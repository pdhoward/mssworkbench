const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  _id: Number,
  type: String,   // set to Message  
  messageid: String,
  brandid: String,
  tagid: String,
  target: Array,   // future - limit scope of campaign - set to 'All'
  content: {
    tag: String,  // text, video, audio, display, hyper, survey
    data: {
      id: String,
      avatar: {
        normal: String  // url for logo
      },
      name: String,
      createdAt: Date,
      heartCount: String,
      ctaType: String,
      ctaCount: String,  // call to action
      type: String  // tweet
    },
    nodes: [
      {
        tag: String, // text, survey, etc
        text: String,
        url: String, // might be a link to a survey - see mongo actions
        alt: String
      }
    ]
  },   
  start: Date,
  stop: Date,
  timestamp: Date,
  updatedOn: Date
}, {collection: 'messages'});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;

/* notes on message data design
for nodes, the array will have a combination of objects, and object will
have a combination of properties depending on the type

1. Text message
tag = text
text = some string

2. a survey - or some other interactive micor app
object 1
tag = text
text = string
object 2
tag = survey (for example)
url = string to an actions db ??
alt = 'form' for example

3. a video
object 1
tag = text
text = string

object 2
tag = video
src = string to https mp4
alt = 'video clip
poster = string to https image

4. an audio clip
object 1 
tag = text
text = string

object 2
tag = audio
src = string to https audio file
alt = audio clip

5. a display message
object 1
tag = text
text = string

object 2
tag = display
src = string to image
alt = some label such as 'qrcode'

6. a hyper link

object 1
tag = text
text = string

object 2
tag = hyper
href = https link for hyper
src = image
alt = label


*/
