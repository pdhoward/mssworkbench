
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
// const { Kafka, 
//         ConfigResourceTypes, 
//         DescribeConfigResponse, 
//         Consumer, 
//         Admin, 
//         GroupDescriptions, 
//         EachBatchPayload } =  require('kafkajs')
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
 ////////// Register and Config Routes ///////////////
 ////////////////////////////////////////////////////
const about =               express.Router()
const header =              express.Router()
const portfolios =          express.Router({mergeParams: true})
const signal =              express.Router({mergeParams: true})
const topics =              express.Router({mergeParams: true})

require('../routes/about')(about)
require('../routes/header')(header)
require('../routes/portfolios')(portfolios)
require('../routes/signal')(signal)
require('../routes/topics')(topics)

/////////////////////////////////////////////////////////
/////////////////// API CATALOGUE //////////////////////
///////////////////////////////////////////////////////

app.use(header)
app.get('/about', about)

app.get('/api/toggle', (req, res, next) => { 
    res.json(toggle)
    next()
  })

app.get('/api/portfolios', [portfolios])

app.get('/api/signal', [toggleState, signal])

app.get('/api/topics:topic', [topics])

exports.start = async (port) => {
	const server = createServer(app);

	//await kafka.Connect();

	return new Promise((resolve, reject) => {
		server.listen(port, resolve);
	});
};