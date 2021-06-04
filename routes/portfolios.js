 

const { g, b, gr, r, y } =  require('../console')

const portfoliodata = require('../data/portfolios')

const portfolios = (router) => {
	router.use(async(req, res, next) => {    
        try {
            //const topics = await withRetry("fetchTopicMetadata", () => kafka.Admin.fetchTopicMetadata())
            // attach an array of objects
            res.status(200).json(portfoliodata)
          }
          catch (error) {
            res.status(500).json({ error: error.toString() })
          }
    next() 
  })
}

module.exports = portfolios

 