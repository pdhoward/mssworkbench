
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
const schemas =             express.Router({mergeParams: true})
const signal =              express.Router({mergeParams: true})
const topics =              express.Router({mergeParams: true})

require('../routes/about')(about)
require('../routes/header')(header)
require('../routes/portfolios')(portfolios)
require('../routes/schemas')(schemas)
require('../routes/signal')(signal)
require('../routes/topics')(topics)

/////////////////////////////////////////////////////////
/////////////////// API CATALOGUE //////////////////////
///////////////////////////////////////////////////////


app.use((req, res, next) => {
  console.log(`---start---`)
  console.log(req.body)
  next()
})
app.use(header)
app.get('/about', about)

app.get('/api/toggle', (req, res, next) => { 
    res.json(toggle)
    next()
  })

app.post('/api/portfolios', [portfolios])

app.post('/api/signal', [toggleState, signal])

app.post('/api/schemas/', [schemas])

//app.get('/api/topics/:topic', [topics])

app.get('/*', function(req,res) {
  console.log(path.join(__dirname, '../client/build', 'index.html'))
  if (!res.headersSent) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  }
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

exports.start = async (port) => {
	const server = createServer(app);

	//await kafka.Connect();

	return new Promise((resolve, reject) => {
		server.listen(port, resolve);
	});
};