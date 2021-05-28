
let output;
let websocket;
let url = ''
let socketurl = ''

if (location.hostname == 'localhost' ) {
    url = `http://${location.host}${'/api/signal'}`
    socketurl = `ws://${location.host}`
} else {
    url = 'https://msspub.onrender.com/api/signal'
    socketurl = `wss://msskafka.onrender.com`
}


const change = () => { 
    fetch(url)       
    let elem = document.getElementById("jsbutton");
    if (elem.value=="Stop Signals") {
     elem.value = "Start Signals"
     elem.className="btn btn-lg btn-success"
    } else {
     elem.value = "Stop Signals"
     elem.className="btn btn-lg btn-danger"
    }
}


const setbg = (color) => {
    document.getElementById("message").style.background=color
    }
const getElement = (id) => document.getElementById(id);

const addMessage = (message) => {
    const pTag = document.createElement('p');
    pTag.appendChild(document.createTextNode(message));
    getElement('messages').appendChild(pTag);
};

const connect = () => {
    //open socket
    if ("WebSocket" in window){
        output.innerHTML = "CONNECTING..." ;
        ws = new WebSocket(`ws://${location.host}`); 
   
        ws.onopen = onOpen;
        ws.onclose = onClose;
        ws.onmessage = onMessage;
        ws.onerror = onError;
        
    } else {
        alert("WebSockets not supported on your browser.");
    } 
} 

// event handlers
const onOpen = (evt) =>{
    //called as soon as a connection is opened
    output.innerHTML += "<p class = 'response'>CONNECTED TO SERVER</p>";
}
const onClose = (evt) => {
    //called when connection is severed
    output.innerHTML += "<p>DISCONNECTED</p>";
} 
const onMessage = (evt) => {   
    const messages = JSON.parse(evt.data);
    messages.forEach(addMessage);
} 
const onError = (evt) => {
    //called on error
    output.innerHTML += "<p class = 'error'>ERROR: " 
      + evt.data + "</p>";
}
const fire = () => {    
    const username = getElement('fname').value || '???'
    ws.send(`${username}: ${getElement('message').value}`);
    getElement('message').value = '';
};

const init = () => {
    output = document.getElementById("sysoutput");    
    connect()
} 

init()
