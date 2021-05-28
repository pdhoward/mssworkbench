const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  _id: Number,
  type: String,   // 'tag'
  class: String,  // product, person, place, fixture, 
  tagid: String,
  brandid: String,
  imdbid: String,  // id for imdb object and location coordinates
  name: String,
  description: String,
  temperature: Number, 
  scale: String,  // fahrenheit, celsius
  timestamp: Date,
  updatedOn: Date
}, {collection: 'tags'});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
