const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activetagSchema = new Schema({
  _id: Number,
  type: String,   // 'activetag'
  tagid: String,  
  detectedOn: Date
}, {collection: 'activetags'});

const ActiveTag = mongoose.model("ActiveTag", activetagSchema);

module.exports = ActiveTag;
