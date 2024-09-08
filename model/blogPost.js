const mongoose = require("mongoose");

const blogScema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image:{
    type:String
  },
  description: {
    type: String,
  },
  scheduleDate: {
    type: String,
  },
  scheduleTime: {
    type: String,
  },
  type: {
    type: String,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const blogPost = new mongoose.model("blogPost", blogScema);
module.exports = blogPost;
