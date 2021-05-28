

const jwt = require('jsonwebtoken')

// Note this is the super secret for signing the JWT
// this should be acquired via .env or a microservice
const JWT_SECRET  = 'thisismysecretkey'
  

// return a fake id in hexadecimal 
const fakeId = size => {
    return new Promise((resolve, reject) => {
        resolve( [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''))
    })   
}   

// generate a random jwt
function token(venue) {
    return new Promise((resolve, reject) => {
        resolve(jwt.sign(venue, JWT_SECRET))
    })	
}

module.exports = {    
    token,
    fakeId
}