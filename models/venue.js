const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const venueSchema = new Schema({
  _id: Number,
  marketid: String,
  type: String,   // set to Venue
  monitors: Array,  // equal to the mac id of the gateway devide
  apitoken: String,
  location: Object,
  address: Object,
  enterprise: { type: Array, default: [] }, // enterprise id
  market: { type: Array, default: [] }, // market id
  geography: { type: Array, default: [] }, // geography id
  lifemode: { type: Array, default: [] }, // life style mode id
  isActive: Boolean,
  isVerified: Object,
  label: String,
  name: String,
  slug: String,
  overview: String,
  stage: String,   // stage of web page publication
  propertyType: { type: String, default: 'Commercial'},
  condition: String, // rating on condition of property
  website: String,
  phone: String,
  termsAndCondition: String,  // for ad placement
  attributes: Array,  // capture traffic, operating hours
  images: Object, // banner images including thumbnail
  image: String, // banner image
  gallery: Array, // property photos
  categories: Array,  // same as eid. future use
  adRates: Array,   // array of prevailing rate objects - time stamped
  isNegotiable: Boolean,
  timestamp: Date,
  updatedOn: Date
}, {collection: 'venues'});

const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
