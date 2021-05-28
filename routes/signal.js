
const {dbProximity} =       require('../db')
const { g, b, gr, r, y } =  require('../console')

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

let cnt = 0
let tagarray = []
let venuearray = []
let subscriberarray = []
let activevenues = []

// Initialization process to load a random set of venues and brand/tags

const init = async () => {
  
  
  await dbProximity.db('proximity').collection('tags')
    .aggregate([{$sample: {size: 1000}}])
    .toArray()
    .then(data => {      
      tagarray = [...data]
    })
 
}
if (dbProximity.isConnected()) {
  console.log(g(`DB Ready`))
  init();
} else {
  dbProximity.connect().then(function () {
    console.log(g(`Reconnect to DB`))
    init();
  });
}

module.exports = signal = (router) => {
	router.use(async(req, res, next) => {
    
    console.log(`Captured ${tagarray.length} tags`)
    console.log(tagarray[100])

    const startSignals = (duration, userid) => new Promise(resolve => {
      const start = new Date().getTime();
    
      let iid;   
    
      (async function loop() {
        const now = new Date().getTime()
        const delta = now - start
        
        //elapsed - close function
        if (delta >= duration) {
          clearTimeout(iid);
          resolve(userid);

        //take action
        } else {
         
          let tag = tagarray[Math.floor(Math.random() * tagarray.length)]
          //capture all venues that were randomly selected
         
          tag.detectedOn = Date.now()
          delete tag._id
          let message = `Product: ${tag.name} Detected: ${tag.detectedOn} -----`
             
           // constant WebSocket.OPEN = 1
          wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify([message]))
            }
            });
          
          iid = setTimeout(loop, 3000)
        }
      })()

    });

    const startRandomSignals = (time, i, prefix) => {

      return new Promise(async (resolve, reject) => {
        let venuename = prefix + i.toString()
        await startSignals(time, venuename)
          .then(v => console.log(`${v} finished`))
        resolve()
      })
      
    }
     
    res.status(200).redirect('/')
    // Function to start generating random product signals 
   
    startRandomSignals(15000, 100, 'mss')     

    next()
  })  
}


 
 
  
  
 

  
