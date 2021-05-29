const {kafka,
       fetchRandomTag,
       fetchRandomSubscriber } =  require('../controllers')
const { g } =  require('../console')

// websocketevents and redi events
const {wss} =               require('../events');
const {events} =            require('../events')

////////////////redis intialization////////////

let pub
let redis

const createServers = () => {
  return new Promise(async (resolve, reject) => {
    const servers = await events()
    resolve(servers)
  })  
}
const startBroadcasts = async() => {
  const servers = await createServers()  
  pub = servers['pub']  
  redis = servers['redis']   
}
startBroadcasts()

//////////////////////////////////////////


let tagarray = []

let producer = {}

/////////////////////////////////////////////
//////////   initialize producer ///////////
///////////////////////////////////////////
const init = async () => {
  //producer = await kafkaproducer() 
}

init()

let isPublishing = false
let id
let x = 0
module.exports = signal = (router) => {
	router.use(async(req, res, next) => {
    const randomStream = (int) => {
      
      id = setInterval(async function() {        
        
        let tag = await fetchRandomTag()      
        
        x++
        tag[0].unitsales = Math.floor(Math.random() * (1000 - 100) + 100);
        tag[0].price = Math.floor(Math.random() * (1000 - 100) + 100) / 100;
        tag[0].seq = x       
      
        // sockets
        wss.clients.forEach((client) => {      
          if (client.readyState === 1) {
              client.send(JSON.stringify(tag))
          }
        })

        // Redis Message
        pub.publish('detect', JSON.stringify(tag))
         // kafka producer - 
         try {
            //let result = await kafka(producer, tag)          
            //console.log(result, x)
          } catch (e) {
            //console.log(e)
          }
      }, int)
    }  
     // Function to start generating random product signals for x number of Venues
    if (isPublishing) {      
      clearInterval(id)      
      isPublishing= false
      // let client know that streaming has stopped
      let status = [{
        type: 'status',
        state: false
      }]
      wss.clients.forEach((client) => {      
        if (client.readyState === 1) {
            client.send(JSON.stringify(status))
        }
      })

      id = {}
      res.status(200).end()
    } else {
      isPublishing = true
      let status = [{
        type: 'status',
        state: true
      }]
      wss.clients.forEach((client) => {      
        if (client.readyState === 1) {
            client.send(JSON.stringify(status))
        }
      })

      randomStream(2000) 
      res.status(200).end() 
    }
    next() 

});
}
   

 
 
  
  
 

  
