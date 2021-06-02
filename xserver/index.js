
///////////////////////////////////////////////////////////////
////////           kafka to redis connect              ///////
//////            mainline processing                 ///////
////// c strategic machines 2018 all rights reserved ///////
///////////////////////////////////////////////////////////

const express =               require('express');
const cors =                  require('cors')
const { createServer } =      require('http');
const serverTiming =          require('server-timing');
const path =                  require('path');
const { Kafka, 
        ConfigResourceTypes, 
        DescribeConfigResponse, 
        Consumer, 
        Admin, 
        GroupDescriptions, 
        EachBatchPayload } =  require('kafkajs')
const { KAFKA_URLS, 
        SCHEMA_REGISTRY_URL, 
        KAFKA_CONNECT_URL } = require("../config")
const { SchemaRegistry, 
        SchemaVersion } =     require('@ovotech/avro-kafkajs')
const { GetTopicsResult, 
        GetTopicResult, 
        TopicsOffsets, 
        ConsumerOffsets, 
        TopicConsumerGroups, 
        TopicOffsets, 
        GetClusterResult, 
        GetTopicOffsetsByTimestapResult, 
        TopicMessage, 
        TopicMessages, 
        GetTopicMessagesResult, 
        GetSubjectsResult, 
        GetSubjectVersionsResult, 
        GetSchemaResult, 
        GetTopicConsumerGroupsResult, 
        GetTopicOffsetsResult, 
        GetConnectorsResult, 
        GetConnectorStatusResult, 
        GetConnectorConfigResult, 
        GetConnectorTasksResult, 
        GetConnectorTaskStatusResult } =  require( "../shared/api")
const { SearchStyle, Includes } =         require( "../shared/search")
const fetch =                             require("node-fetch");
const { Schema, Type } =                  require("avsc")
const { v4 } =                            require('uuid')
const { g, b, gr, r, y } =                require('../console');

// Express app
const app = express();
const server = createServer(app);

const Port = process.env.RUN_PORT || 5000

//////////////////////////////////////////////////////////////////////////
////////////////////  Register Middleware       /////////////////////////
////////////////////////////////////////////////////////////////////////
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(serverTiming()); 

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
  }

const isDev = (app.get('env') === 'development');
console.log('isDev: ' + isDev);

//////////////////////////////////////////////////////////////////
////////////  Event Registration for streams and db      ////////
////////////////////////////////////////////////////////////////

const {wss} = require('../events');

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (socket) => {
        wss.emit('connection', socket, request);
    });     
})

// status of streaming service
let toggle = {
    state: false
  }
  
const toggleState = (req, res, next) => { 
  if (toggle.state) {
    toggle.state = false
  } else {
    toggle.state = true
  }
  next()
}
 //////////////////////////////////////////////////////
 //////////           RESTRUCTURE        //////////////
 ////////////////////////////////////////////////////

 console.log(`KAFKA_URLS=${KAFKA_URLS}`)
 console.log(`SCHEMA_REGISTRY_URL=${SCHEMA_REGISTRY_URL}`)
 console.log(`KAFKA_CONNECT_URL=${KAFKA_CONNECT_URL}`)
 
 ////////////////////////////fake data/////////////////////
 const faketopics = [{
     topic: 'sales',
     num_partitions: 6,
     raw: null,
     history: null,
     offsets: 10,
     config: null,
     groups: 'financials',
     num_messages: 10,
     num_groups:`Unknown`,
     num_configs: `Unknown`,
   partitions: [1,2,3,4,5,6]
   },
   {
   topic: 'order',
   num_partitions: 6,
   raw: null,
   history: null,
   offsets: 10,
   config: null,
   groups: 'financials',
   num_messages: 10,
   num_groups:`Unknown`,
   num_configs: `Unknown`,
   partitions: [1,2,3,4,5,6, 7, 8]
   }
 ]


const TopicQueryInput = { topic: String, partition: Number, limit: Number, offset: Number, search: String, timeout: Number, searchStyle: SearchStyle, trace: Boolean}

const schemaRegistry = new SchemaRegistry({ uri: SCHEMA_REGISTRY_URL });
 
function KafkaClient () {
   
  this.Kafka = Kafka;
  this.Admin = Admin;
   
  this.Connect = async () => {
     let Kafka = new Kafka({
       clientId: 'MSS',
       ssl: true,
       brokers: KAFKA_URLS
     })
     let Admin = Kafka.admin()
 
     console.log(`connecting to admin`)
     let connected = false
     while (!connected) {
       try {
         await kafka.Admin.connect()
         connected = true
       } catch (error) {
         console.error("Error connecting admin, retrying in a second", error)
         await new Promise( resolve => setTimeout(resolve, 1000) );
       }
     }
     console.log(`connected to admin`)
   }
 }
 
 const kafka = new KafkaClient();
 
 async function withRetry(name, fun = () => new Promise()) {
   try {
     return await fun();
   }
   catch (error) {
     console.error(`Error when trying ${name}, reconnecting kafka. Error: `, error)
     await kafka.Connect();
     return await fun();
   }
 }
 
 app.get("/api/portfolios", async (req, res) => {
   try {
     //const topics: GetTopicsResult = await withRetry("fetchTopicMetadata", () => kafka.Admin.fetchTopicMetadata(undefined as any))
     // attach an array of objects
     res.status(200).json({topics: faketopics})
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/topics", async (req, res) => {
   try {
     //const topics: GetTopicsResult = await withRetry("fetchTopicMetadata", () => kafka.Admin.fetchTopicMetadata(undefined as any))
     // attach an array of objects
     res.status(200).json({topics: faketopics})
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/topic/:topic", async (req, res) => {
   try {
     const offsets = await withRetry("fetchTopicOffsets", () => kafka.Admin.fetchTopicOffsets(req.params.topic))
     offsets.sort((o1, o2) => o1.partition - o2.partition)
     try {
       const groups = await getTopicConsumerGroups(req.params.topic)
       try {
         const config = await getConfig(req.params.topic, ConfigResourceTypes.TOPIC)
         res.status(200).json({offsets, groups, config} )
       }
       catch (error) {
         console.error(`Error while fetching config for topic ${req.params.topic}:`, error)
         res.status(200).json({offsets, groups} )
       }
     }
     catch (error) {
       console.error(`Error while fetching consumer groups for topic ${req.params.topic}:`, error)
       res.status(200).json({offsets} )
     }
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/topic/:topic/offsets", async (req, res) => {
   try {
     const offsets = await withRetry("fetchTopicOffsets", () => kafka.Admin.fetchTopicOffsets(req.params.topic))
     offsets.sort((o1, o2) => o1.partition - o2.partition)
     const out = {offsets}
     res.status(200).json(out)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/topic/:topic/config", async (req, res) => {
   try {
     const config = await getConfig(req.params.topic, ConfigResourceTypes.TOPIC)
     res.status(200).json(config)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/broker/:broker/config", async (req, res) => {
   try {
     const config = await getConfig(req.params.broker, ConfigResourceTypes.BROKER)
     res.status(200).json(config)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/topic/:topic/consumer_groups", async (req, res) => {
   try {
     const groups = await getTopicConsumerGroups(req.params.topic)
     const offsets = await withRetry("fetchTopicOffsets", () => kafka.Admin.fetchTopicOffsets(req.params.topic))
     const partitonToOffset = {}
     for (const offset of offsets) {
       partitonToOffset[offset.partition] = offset
     }
     for (const group of groups) {
       for (const offsets of group.offsets) {
         offsets.partitionOffsets = partitonToOffset[offsets.partition]
       }
     }
     res.status(200).json(groups)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/groups", async (req, res) => {
   try {
     const consumers = await withRetry("listGroups", () => kafka.Admin.listGroups())
     const ids = consumers.groups.map(g => g.groupId)
     const groups = await withRetry("describeGroups", () => kafka.Admin.describeGroups(ids))
     modifyGroups(groups)
     res.status(200).json(groups)
   }
   catch (error) {
     console.error(error)
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/members/:group", async (req, res) => {
   try {
     const groups = await withRetry("describeGroups", () => kafka.Admin.describeGroups([req.params.group]))
     modifyGroups(groups)
     res.status(200).json(groups.groups[0].members)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 //todo: remove this when https://github.com/tulios/kafkajs/issues/755 is resolved (and add types)
 function modifyGroups(groups) {
   for (const group of (groups).groups) {
     for (const member of group.members) {
       member.memberAssignment = stringFromArray(member.memberAssignment)
       member.memberMetadata = stringFromArray(member.memberMetadata)
     }
   }
 }
 
 function stringFromArray(data) {
   var count = data.length;
   var str = "";
 
   for(var index = 0; index < count; index += 1)
     str += String.fromCharCode(data[index]);
 
   return str;
 }
 
 app.get("/api/cluster", async (req, res) => {
   try {
     const cluster = await withRetry("describeCluster", () => kafka.Admin.describeCluster())
     res.status(200).json(cluster)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/offsets/:topic/:timestamp", async (req, res) => {
   try {
     const topic = req.params.topic
     const timestamp = req.params.timestamp ? parseInt(req.params.timestamp.toString()) : 0
     const entries = await withRetry("fetchTopicOffsetsByTimestamp", () => kafka.Admin.fetchTopicOffsetsByTimestamp(topic, timestamp))
     res.status(200).json(entries)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/messages/:topic/:partition", async (req, res) => {
   try {
     let limit = req.query.limit ? parseInt(req.query.limit.toString()) : 100
     const offset = req.query.offset ? parseInt(req.query.offset.toString()) : 0
     const topic = req.params.topic
     const search = req.query.search ? req.query.search : ""
     const searchStyle = req.query.search_style ? req.query.search_style : ""
     const timeout = req.query.timeout ? parseInt(req.query.timeout.toString()) : 20000
     const trace = req.query.trace === `true`
     const partition = parseInt(req.params.partition)
     const partitions = await withRetry("fetchTopicOffsets", () => kafka.Admin.fetchTopicOffsets(topic))
     for (const partitionOffsets of partitions) {
       if (partitionOffsets.partition !== partition) {
         continue
       }
       const maxOffset = parseInt(partitionOffsets.high)
       if (maxOffset === 0 || offset > maxOffset) {
         res.status(200).json({messages: []})
         return
       }
       if (offset + limit > maxOffset) {
         limit = maxOffset - offset
       }
       if (limit <= 0) {
         res.status(200).json({messages: []})
         return
       }
       const messages = await getMessages({topic, partition, limit, offset, search, searchStyle, timeout, trace}, res)
       res.status(200).json(messages)
       return
     }
     res.status(404).json({ error: `partition ${partition} not found for topic ${topic}`})
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/schema-registry/subjects", async (req, res) => {
   try {
     const subjects = await schemaRegistry.getSubjects()
     res.status(200).json(subjects)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 });
 
 app.get("/api/schema-registry/versions/:subject", async (req, res) => {
   try {
     const versions = await schemaRegistry.getSubjectVersions(req.params.subject)
     res.status(200).json(versions)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/schema-registry/schema/:subject/:version", async (req, res) => {
   try {
     const schemaVersion = await schemaRegistry.getSubjectVersion(req.params.subject, parseInt(req.params.version))
     const schema = JSON.parse(schemaVersion.schema)
     const out = { schema, id: schemaVersion.id }
     res.status(200).json(out)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/kafka-connect/connectors", async (req, res) => {
   try {
     const response = await fetch(`${KAFKA_CONNECT_URL}/connectors`)
     if (response.status >= 400) {
       const txt = await response.text()
       const error = `failed to get connectors, status code ${response.status}, error: ${txt}`
       res.status(500).json({ error })
       return
     }
     const data = await response.json()
     const out = data;
     res.status(200).json(out)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/kafka-connect/connector/:connector/status", async (req, res) => {
   try {
     const response = await fetch(`${KAFKA_CONNECT_URL}/connectors/${req.params.connector}/status`)
     if (response.status >= 400) {
       const txt = await response.text()
       const error = `failed to get status for connector ${req.params.connector}, status code ${response.status}, error: ${txt}`
       res.status(500).json({ error })
       return
     }
     const data = await response.json()
     res.status(200).json(data)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/kafka-connect/connector/:connector/config", async (req, res) => {
   try {
     const response = await fetch(`${KAFKA_CONNECT_URL}/connectors/${req.params.connector}/config`)
     if (response.status >= 400) {
       const txt = await response.text()
       const error = `failed to get config for connector ${req.params.connector}, status code ${response.status}, error: ${txt}`
       res.status(500).json({ error })
       return
     }
     const data = await response.json()
     res.status(200).json(data)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/kafka-connect/connector/:connector/tasks", async (req, res) => {
   try {
     const response = await fetch(`${KAFKA_CONNECT_URL}/connectors/${req.params.connector}/tasks`)
     if (response.status >= 400) {
       const txt = await response.text()
       const error = `failed to get tasks for connector ${req.params.connector}, status code ${response.status}, error: ${txt}`
       res.status(500).json({ error })
       return
     }
     const data = await response.json()
     res.status(200).json(data)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/api/kafka-connect/connector/:connector/tasks/:task/status", async (req, res) => {
   try {
     const response = await fetch(`${KAFKA_CONNECT_URL}/connectors/${req.params.connector}/tasks/${req.params.task}/status`)
     if (response.status >= 400) {
       const txt = await response.text()
       const error = `failed to get task status for connector ${req.params.connector}, task ${req.params.task}, status code ${response.status}, error: ${txt}`
       res.status(500).json({ error })
       return
     }
     const data = await response.json()
     res.status(200).json(data)
   }
   catch (error) {
     res.status(500).json({ error: error.toString() })
   }
 })
 
 app.get("/*", (req, res) => {
   res.render("index");
 });
 
 const getConfig = async (name, type) => {
   return await withRetry("describeConfigs", () => kafka.Admin.describeConfigs({
     includeSynonyms: false,
     resources: [
       {
       type, name
       }
     ]
   }))
 }
 
 const getTopicConsumerGroups = async (topic) => {
   const consumers = await withRetry("listGroups", () => kafka.Admin.listGroups())
   const ids = consumers.groups.filter(c => c.protocolType === `consumer`).map(g => g.groupId)
   const groups = await withRetry("describeGroups", () => kafka.Admin.describeGroups(ids))
   modifyGroups(groups)
   let found = []
   for (const group of groups.groups) {
     for (const member of group.members) {
       if (member.memberAssignment.includes(`${topic}\u0000`)) { //todo: we use suffix delimiter \u0000 but the prefix delimiter looks different each time?
         const offsets = await withRetry("fetchOffsets", () => kafka.Admin.fetchOffsets({groupId: group.groupId, topic: topic}))
         found.push({groupId: group.groupId, offsets})
       }
     }
   }
   return found
 }
 
 const endBatch = (res, batchIdx) => {
   res.endTime(`batch_${batchIdx}`);
   res.startTime(`time_to_batch${batchIdx+1}`, `time to batch ${batchIdx+1}`)
 }
 
 const getMessages = async (input, res) => {
   const groupId = `krowser-${Date.now()}-${uuidv4()}`
   res.startTime('connect_kafka', 'connect kafka');
   const consumer = kafka.Kafka.consumer({ groupId, allowAutoTopicCreation: false })
   await consumer.connect()
   res.endTime('connect_kafka');
 
   const messages = []
   let numConsumed = 0
   let batchIdx = 0
   const endOffset = input.offset + input.limit - 1
   console.log(`Querying topic ${input.topic} (partition ${input.partition}) at offset=${input.offset}, limit=${input.limit}`)
   res.startTime('subscribe', 'subscribe');
   consumer.subscribe({ topic: input.topic, fromBeginning: false })
   res.endTime('subscribe');
   const consumed = new Set()
   let hasTimeout = false
   const p = new Promise(async (resolve, reject) => {
     setTimeout(() => {
       hasTimeout = true
       resolve()
     }, input.timeout || 20000);
     res.startTime(`time_to_batch${batchIdx+1}`, `time to batch ${batchIdx+1}`)
     await consumer.run({
       autoCommit: false,
       eachBatchAutoResolve: true,

       eachBatch: async (payload) => {
         batchIdx += 1
         res.endTime(`time_to_batch${batchIdx}`)
         if (payload.batch.partition !== input.partition) {
           console.log(`Ignoring batch from partition ${payload.batch.partition}, expecting partition ${input.partition}`)
           endBatch(res, batchIdx)
           return
         }
         if (payload.batch.topic !== input.topic) {
           console.log(`Ignoring batch from a different topic: ${payload.batch.topic} (expecting ${input.topic})`)
           endBatch(res, batchIdx)
           return
         }
         const firstOffset = payload.batch.firstOffset()
         if (firstOffset === null) {
           console.log(`Ignoring batch with no first offset`)
           endBatch(res, batchIdx)
           return
         }
         const low = parseInt(firstOffset)
         if (low > endOffset) {
           console.log(`Ignoring batch with a too high offset ${low} (expecting ${input.offset}-${endOffset})`)
           endBatch(res, batchIdx)
           return
         }
         const lastOffset = payload.batch.lastOffset()
         if (lastOffset === null) {
           console.log(`Ignoring batch with no last offset`)
           endBatch(res, batchIdx)
           return
         }
         const high = parseInt(lastOffset)
         if (high < input.offset) {
           console.log(`Ignoring batch with a too low offset ${high} (expecting ${input.offset}-${endOffset})`)
           endBatch(res, batchIdx)
           return
         }
         console.log(`---Batch: ${payload.batch.firstOffset()} - ${payload.batch.lastOffset()} (len: ${payload.batch.messages.length})`)
         res.startTime(`batch_${batchIdx}`, `batch ${batchIdx}`)
       

         for (const message of payload.batch.messages) {
           if (input.trace) {
             console.log(`---MESSAGE: ${message.offset}---`)
           }

           let schemaType  = undefined;
           if (message.value === null) {
             console.log(`Message value is null`)
           } else {
             try {
               const { type, value } = await schemaRegistry.decodeWithType(message.value);
               message.value = value;
               schemaType = type;
             } catch (error) {
               if (input.trace) {
                 console.log(`Not an avro message? error: ${error}`);
               }
             }
           }
           const value = message.value ? message.value.toString() : "";
           const key = message.key ? message.key.toString() : "";
           if (input.trace) {
             console.log({
               partition: payload.batch.partition,
               offset: message.offset,
               value: value,
               schemaType: schemaType,
               key: key,
             })
           }
 
           if (consumed.has(message.offset)) {
             console.log(`Ignoring duplicate message from offset ${message.offset}`)
             continue
           }
           consumed.add(message.offset)
 
           const offset = parseInt(message.offset)
           if (offset < input.offset) {
             console.log(`Ignoring message from an old offset: ${offset} (expecting at least ${input.offset})`)
             continue
           }
           numConsumed++
           let filteredOut = false
           if (input.search) {
             const text = `${value},${key},${schemaType?.name ?? ""}`
             if (!Includes(text, input.search, input.searchStyle)) {
               filteredOut = true
               if (input.trace) {
                 console.log(`Ignoring message from offset ${message.offset}, filtered out by search`)
               }
             }
           }
           if (!filteredOut) {
             messages.push({ topic: payload.batch.topic, partition: payload.batch.partition, message, key, value, schemaType })
           }
           if (numConsumed >= input.limit || offset >= endOffset) {
             break
           }
         }

         if (numConsumed >= input.limit || high >= endOffset) {
           resolve()
         }
         endBatch(res, batchIdx)
       }
     })
   })
 
   res.startTime('seek', 'seek');
   consumer.seek({ topic: input.topic, partition: input.partition, offset: input.offset.toString() })
   res.endTime('seek');
   try {
     res.startTime('consume', 'consume');
     await p;
     res.endTime('consume');
     return { messages, hasTimeout }
   }
   finally {
     res.startTime('cleanupConsumer', 'cleanup consumer');
     cleanupConsumer(consumer, groupId) //not awaiting this as we don't want to block the response
     res.endTime('cleanupConsumer');
   }
 }
 
 const cleanupConsumer = async (consumer, groupId) => {
   try {
     await consumer.stop()
   }
   catch (error) {
     console.error(`error stopping consumer`, error)
   }
   for (var i = 3; i >= 0; i--) {
     try {
       const res = await withRetry("deleteGroups", () => kafka.Admin.deleteGroups([groupId]))
       console.log(`Delete consumer group ${res[0].groupId} result: ${res[0].errorCode || "success"}`)
       return
     }
     catch (error) {
       console.error(`Error deleting consumer group ${groupId} (retries left = ${i}):`, error)
       await new Promise( resolve => setTimeout(resolve, 300) );
     }
   }
 }



 //////////////////////////////////////////////////////
 ////////// Register and Config Routes ///////////////
 ////////////////////////////////////////////////////
const about =               express.Router()
const header =              express.Router()
const signal =              express.Router({mergeParams: true})

require('../routes/about')(about)
require('../routes/header')(header)
require('../routes/signal')(signal)

/////////////////////////////////////////////////////////
/////////////////// API CATALOGUE //////////////////////
///////////////////////////////////////////////////////

app.use(header)
app.get('/about', about)
app.get('/api/toggle', (req, res, next) => { 
    res.json(toggle)
    next()
  })
app.get('/api/signal', [toggleState, signal])


exports.start = async (port) => {
	const server = createServer(app);

	await kafka.Connect();

	return new Promise((resolve, reject) => {
		server.listen(port, resolve);
	});
};