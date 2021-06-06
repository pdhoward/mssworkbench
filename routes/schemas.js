 

const { g, b, gr, r, y } =  require('../console')
const topics = require('../data/topics')
const schemadata = require('../data/schemas')
const apps = require('../data/apps')

const schemas = (router) => {
	router.use(async(req, res, next) => {  
        console.log(`The topic is ${req.params.schema}`)  
        try {
            //const topics = await withRetry("fetchTopicMetadata", () => kafka.Admin.fetchTopicMetadata())
            // attach an array of objects
            res.status(200).json(schemadata)
          }
          catch (error) {
            res.status(500).json({ error: error.toString() })
          }
    next() 
  })
}

module.exports = schemas

 