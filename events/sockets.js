
const { g, b, gr, r, y } =        require('../console');

const messages = ['Archived messages']
/////////////////////////////////////////////////////
/////////////////////socket events //////////////////
////////////////////////////////////////////////////

// https://socket.io/docs/emit-cheatsheet/

const socketevents = (ws, wss) => {   
        
    ws.on('message', (message) => {
        console.log('received:', message);
        messages.push(message)
            // constant WebSocket.OPEN = 1
        wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify([message]))
        }
        });
    });

    ws.on('open', () => {
        console.log('Connected');
        ws.send(Date.now());
    });
    
    ws.on('close', () => {
        console.log('Disconnected');
    });    
    
    console.log(g("Socket events registered"))
}

module.exports = {
    socketevents
}