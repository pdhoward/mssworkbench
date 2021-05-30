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

module.exports = tagSchema