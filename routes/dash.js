
const WebSocket = require("ws");
const { g, b, gr, r, y } =  require('../console')

const broadcast = (clients, message) => {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {

            client.send(message);
        }
    });
};


const dash = (router) => {

	router.get(async(req, res, next) => { 
        let wss = req.wss
        console.log(`----------route fired-----`)
      
        wss.once('connection', (ws) => {
            console.log(gr(`Socket Connected with Client`))
            console.info("Total connected clients:", wss.clients.size);
            app.locals.clients = wss.clients;
            ws.on('message', (message) => {
              console.log('received:', message);
              messages.push(message);
              wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify([message]));
                }
              });
            });  
        });
      //broadcast(req.app.locals.clients, "Bark!");
      res.sendStatus(200)
      next()

  })  
}

module.exports = dash
 
  
  
 

  
