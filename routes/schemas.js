 
const flatten = require('flat')
const { g, b, gr, r, y } =  require('../console')
const {schemadata} = require('../data/schemas')

const schemas = (router) => {
	router.use(async(req, res, next) => {          
        let unknownSchema = [{title: 'Unknown Schema', description: 'Contact support to resolve'} ]
        
        let schema = req.body.segment 
        let selectedSchema = []
        if (schema == 'all') {
          selectedSchema = [...schemadata]
        } else {
          selectedSchema = schemadata.filter(s => s.title == schema)
        }         
        
        if (selectedSchema.length == 0) {
          selectedSchema = [...unknownSchema]
        }
        let flatSchema = flatten(selectedSchema[0])

        // to do - add functions to create a dictionary, validations, cross-walk
        //console.log(flatSchema)
        
        try {
            //const topics = await withRetry("fetchTopicMetadata", () => kafka.Admin.fetchTopicMetadata())
            // attach an array of objects
            res.status(200).json(selectedSchema)
          }
          catch (error) {
            res.status(500).json({ error: error.toString() })
          }
        next() 
  })
}

module.exports = schemas

 