const mongoose = require("mongoose")
const Schema = mongoose.Schema 

const Chats100 = Schema({
  message: {
    type:String,
    required: true,
  },
  room:{
    type:String,
    required: true,
  },
  userName:  {
    type:String,
    required: true,
  },
  userEmail:{
    type:String,
    required: true,
  }
},{timestamps: true})


const OldChart = mongoose.model("OldChart",Chats100) 

module.exports = OldChart