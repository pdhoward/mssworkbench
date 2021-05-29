const WebSocket =               require('ws')
const {socketevents} =          require('./sockets')
const { g, b, gr, r, y } =      require('../console');

////////////////////////////////////////////////////////////////
////////////////Register Events and Start Server //////////////
//////////////////////////////////////////////////////////////
const {redisevents} =           require('./redis')

const wss = new WebSocket.Server({noServer: true });

const register = (socket, wss) => {    
  socketevents(socket, wss)  
}

// const events = () => {
//   return new Promise(async (resolve, reject) => {
//     let {pub, redis} = await redisevents()
//     resolve({pub, redis}) 
//   })  
// }

wss.on("connection", (socket, req) => {
    register(socket, wss)
    console.log(gr(`Socket Connected with Client`))
    console.info("Total connected clients:", wss.clients.size);
})

module.exports = {
      wss
      //events
    }