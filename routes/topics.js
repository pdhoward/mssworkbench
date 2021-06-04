 

const { g, b, gr, r, y } =  require('../console')
const topics = require('../data/topics')
const schemas = require('../data/schemas')
const apps = require('../data/apps')

const portfolios = (router) => {
	router.use(async(req, res, next) => {  
        console.log(`The topic is ${req.params.topic}`)  
        try {
            //const topics = await withRetry("fetchTopicMetadata", () => kafka.Admin.fetchTopicMetadata())
            // attach an array of objects
            res.status(200).json(topics)
          }
          catch (error) {
            res.status(500).json({ error: error.toString() })
          }
    next() 
  })
}

module.exports = portfolios

 