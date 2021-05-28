const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const metricSchema = new Schema({
  _id: Number,
  type: String,   // 'metric'
  timestamp: Date,
  marketid: String,  
  event: String,  // subscriber detected, page view, page click
  messagesdelivered: Array,  // ids of messages rendered
}, {collection: 'metrics'});

const Metrics = mongoose.model("Metrics", metricSchema);

module.exports = Metrics;
