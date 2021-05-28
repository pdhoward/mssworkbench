const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = new Schema({
  _id: Number,
  brandid: String,
  type: String,   // set to Brand  
  location: Object,
  address: Object,
  industry: String, // is Consumer Staples 
  symbol: String,   // stock trading
  isActive: Boolean,
  isVerified: Object,
  label: String,
  name: String,
  slug: String,
  overview: String,  
  website: String,
  phone: String, 
  image: String, // banner image 
  timestamp: Date,
  updatedOn: Date
}, {collection: 'brands'});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
