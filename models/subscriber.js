const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriberSchema = new Schema({
  _id: Number,
  type: String,   // set to Subscriber  
  subscriberid: String,   // uuid
  email: String,
  cell: String,
  token: Number,
  name: String,  
  isVerified: Boolean,
  preferences: Object,
  isActive: Boolean,
  device: String,
  timestamp: Date,
  updatedOn: Date
}, {collection: 'subscribers'});

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = Subscriber;
