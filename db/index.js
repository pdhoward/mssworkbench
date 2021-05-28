
const Mongo =               require('mongodb').MongoClient;
const { g, b, gr, r, y } =  require('../console')

const proximityurl = process.env.ATLAS_PROXIMITY_URI


const dbProximity = new Mongo(proximityurl, { useNewUrlParser: true, useUnifiedTopology: true });
dbProximity.connect(err => {
  if (err) {
    console.log('Error connecting to Proximity')
  } else {    
    console.log(b(`Proximity MongoDB is Live`))
  }
})

  module.exports = {     
      dbProximity
  }