
///////////////////////////////////////////////////////////////
////////           kafka to redis connect              ///////
//////            mainline processing                 ///////
////// c strategic machines 2018 all rights reserved ///////
///////////////////////////////////////////////////////////

const express =               require('express');

const { createServer } =      require('http');
const path =                  require('path');
const { g, b, gr, r, y } =    require('../console');

// Express app
const app = express();

const server = createServer(app);

const Port = process.env.RUN_PORT || 5000

//////////////////////////////////////////////////////////////////////////
////////////////////  Register Middleware       /////////////////////////
////////////////////////////////////////////////////////////////////////

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '../public')))

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
app.get('/api/signal', signal)

// start server
server.listen(Port, () => console.log(g(`listening on port ${Port}`)))
