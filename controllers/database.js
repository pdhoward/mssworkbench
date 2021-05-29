const {conn} =              require('../db')
const subscriberSchema = 	require('../models/Subscriber.js')
const tagSchema = 	        require('../models/Tag.js')
const venueSchema = 	    require('../models/Venue.js')
const brandSchema =         require('../models/Brand.js')
const { g, b, gr, r, y } =  require('../console')

///////////////////////////////////
////   constants              ////
/////////////////////////////////

const url = process.env.ATLAS_PROXIMITY_URI

/**
 * Search the database for a venue
 * @param {String} token The user's access token
 */

const findVenue = (venue) => {
    return new Promise(async (resolve, reject) => {      
		let db = await conn(url)		
		let Venue = db.model('Venue', venueSchema)
        let token = venue       
        let doc = await Venue.findOne({monitors: token }).lean()                   
        resolve(doc)      
    })
}

const fetchBrand = (brand) => {
    return new Promise(async (resolve, reject) => {      
		let db = await conn(url)		
		let Brand = db.model('Brand', brandSchema)
        let id = brand      
        let doc = await Brand.findOne({brandid: id }).lean()                   
        resolve(doc) 
    })
}

const findSubscriberAndUpdate = (signal, venue) => {
    return new Promise(async (resolve, reject) => {  
        let db = await conn(url)		
		let Subscriber = db.model('Subscriber', subscriberSchema)
        let signalUUID = signal.ibeaconUuid
        let marketid = venue[0].marketid
        let marketstamp = Date.now()
        // updates doc but returns the pre-updated one - with marketstamp reflecting time of last detected signal
        let result = await Subscriber.findOneAndUpdate({uuid: signalUUID }, {$set: {marketid: marketid, marketstamp: marketstamp}, $inc: {marketnotices: 1}})
                         
        if (result.value) {                    
            resolve([result.value])
        } else {
            resolve([])
        }                
                
    })
}


// select a sample of stores
const fetchStoreSample = ( ) => {
    return new Promise(async (resolve, reject) => {  
        let db = await conn(url)		
		let Venue = db.model('Venue', venueSchema)
        let result = await Venue.find({market: {$in: ['Grocery Stores', 'Supermarkets']}}).lean()
        let newarray = result.map(d => d.marketid)
        resolve(newarray)            
    })
}

// select a sample of product tags
const fetchTagSample = () => {
    return new Promise(async (resolve, reject) => {  
        let db = await conn(url)		
		let Tag = db.model('Tag', tagSchema)     

        let data = await Tag.aggregate([{$sample: {size: 1000}}])
        resolve(data)
    })
}

// select a sample of subscribers
const fetchSubscribers = () => {
    return new Promise(async (resolve, reject) => {  
        let db = await conn(url)		
		let Subscriber = db.model('Subscriber', subscriberSchema)  

        let data = await Subscriber.aggregate([{$sample: {size: 5000}}])
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

// select a sample of subscribers
const fetchRandomSubscriber = () => {
    return new Promise(async (resolve, reject) => {  
        let db = await conn(url)		
		let Subscriber = db.model('Subscriber', subscriberSchema)  

        let data = await Subscriber.aggregate([{$sample: {size: 1}}])
        resolve(data)
    })
}
module.exports = {    
    findVenue,
    fetchBrand,
    findSubscriberAndUpdate,   
    fetchStoreSample,
    fetchTagSample,
    fetchSubscribers,
    fetchRandomTag,
    fetchRandomSubscriber
}

