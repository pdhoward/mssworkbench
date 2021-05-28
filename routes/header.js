
const { g, b, gr, r, y } =  require('../console')

const header = (router) => {
	router.use(async(req, res, next) => {    
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next() 
  })
}

module.exports = header
 
  
  
 

  
