 
const flatten = require('flat')
const { g, b, gr, r, y } =  require('../console')
const {algodata} = require('../data/algorithms')

const algorithms = (router) => {
	router.use(async(req, res, next) => {          
        let unknownAlgorithm = [{title: 'Unknown Algorithm', description: 'Contact support to resolve'} ]
        console.log(`----schemas l 12----`)
        console.log(req.body)
        let algorithm = req.body.segment         
        let selectedAlgorithm = algodata.filter(s => s.title == algorithm) 
        
        if (selectedAlgorithm.length == 0) {
          selectedAlgorithm = [...unknownAlgorithm]
        }
        let flat = flatten(selectedAlgorithm[0])

        // to do - add functions to create a dictionary, validations, cross-walk
        //console.log(flat)
        
        try {
            //const topics = await withRetry("fetchTopicMetadata", () => kafka.Admin.fetchTopicMetadata())
            // attach an array of objects
            res.status(200).json(selectedAlgorithm)
          }
          catch (error) {
            res.status(500).json({ error: error.toString() })
          }
    next() 
  })
}

module.exports = algorithms

 