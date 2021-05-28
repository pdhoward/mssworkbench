
const { g, b, gr, r, y } =  require('../console')

const about = (router) => {

	router.use(async(req, res, next) => {    
   let html = `<h2>Welcome to the Atlas Code Pattern </h2>
               <h4> Please reference the README for usage </h4>`
   res.send(html)
   next()

  })  
}

module.exports = about
 
  
  
 

  
