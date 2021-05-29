
//////////////////////////////////////////////////////
////////   mongoDB connection manager         ///////
////////////////////////////////////////////////////

const mongoose =          require("mongoose")
const Cache =             require('lru-cache')

const dbOptions = {
  	poolSize: 10, // Maintain up to x socket connections        
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true }

const cacheOptions = {
    max: 500,
    length: function (n, key) { return n * 2 + key.length },
    dispose: function (key, n) {
      console.log(`${key} connection closed`)
      n.close() }, // auto close based on max age
    maxAge: 1000 * 60 * 10,
    updateAgeOnGet: true
}

const cache = new Cache(cacheOptions)

const log = console

module.exports = (url, dbName) => {

  return new Promise(async (resolve, reject) => {
        
      const api = url;  // dbname embedded in Atlas uri
      let conn;
      conn = await cache.get(api)  

      // if connection is in cache, will reuse it, otherwise create it
      if (conn) {
        //log.info('Reusing existing MongoDB connection')             
        resolve(conn)                 
      }
      else {      

        log.info('Creating new connection for ' + api);
       
        const conn = await mongoose.createConnection(api, dbOptions)
        await cache.set(api, conn) 
        log.info(`Mongo connected at ${api}`)
                     
        resolve(conn)        

    }
  })
}
