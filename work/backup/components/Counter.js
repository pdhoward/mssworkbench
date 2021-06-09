import React, {useState, useEffect} from "react";
import CardBody from "./CardBody";
import { w3cwebsocket as W3CWebSocket } from "websocket";

let socketurl = ''
let url = ''
let toggleurl = ''

if (location.hostname == 'localhost' ) {
    url = `http://${'localhost:5000'}${'/api/signal'}`
    toggleurl = `http://${'localhost:5000'}${'/api/toggle'}`
    socketurl = `ws://${'localhost:5000'}`
} else {
    url = 'https://msspub.onrender.com/api/signal'
    toggleurl = 'https://msspub.onrender.com/api/toggle'
    socketurl = `wss://msspub.onrender.com`
}

const socket = new W3CWebSocket(socketurl);

const Counter = () => {
  const [product, setProduct] = useState(0) 
  const [toggle, setToggle] = useState(false)

  // on component load set the button state based on server state
  useEffect(() => {
    fetch(toggleurl)
        .then(response => response.json())
        .then(data => {
          console.log(data)
            setToggle(data.state)
        })
        .catch(err => console.error(err))
  }, []);

  useEffect(() => {
    socket.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    socket.onmessage = (message) => { 
      let data = JSON.parse(message.data)
      
      // product 
      if (data[0].type == 'tag') {
        // increment product
       setProduct(product + 1)
      }      
       // button state
      if (data[0].type == 'status') { 
        // toggle button
        setToggle(data[0].state)
     }    
       
    }
  })
  const change = () => {   
    fetch(url)        
}
    return (
      <div className="card text-center">
        <div className="card-header bg-primary text-white">
           <h3>MSS International Lab</h3>
           <h4>Workbench Messages Sent From Kafka Stream</h4>
        </div>
        <CardBody
             product={product}            
             change={change}
             toggle={toggle}
        />
      </div>
    );
  }


export default Counter;