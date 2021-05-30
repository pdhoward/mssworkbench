const {conn} =              require('../db')
//const tagSchema = 	        require('../models/Tag.js')
const { g, b, gr, r, y } =  require('../console')

const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
		type: { type: String },
		class: { type: String },
		tagid: { type: String},
        brandid: String,
        imdbid: String,
        name: String,
        description: String,
        temperature: String,
        scale: String,
        timestamp: Date,
        updatedOn: Date

	})

///////////////////////////////////
////   constants              ////
/////////////////////////////////

const url = process.env.ATLAS_PROXIMITY_URI

/**
 * Search the database for a venue
 * @param {String} token The user's access token
 */



// select a sample of product tags
const fetchTagSample = () => {
    return new Promise(async (resolve, reject) => {  
        let db = await conn(url)		
		let Tag = db.model('Tag', tagSchema)     

        let data = await Tag.aggregate([{$sample: {size: 1000}}])
        resolve(data)
    })
}


// return a random product tag - returns a lean array
const fetchRandomTag = () => {
    return new Promise(async (resolve, reject) => {  
        let db = await conn(url)		
		let Tag = db.model('Tag', tagSchema)     

        let data = await Tag.aggregate([{$sample: {size: 1}}])
        resolve(data)
    })
}

module.exports = {  
    fetchTagSample,    
    fetchRandomTag
   
}

