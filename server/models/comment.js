const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const CommentsSchema = new Schema({
  author: String,
  text: String,
  parentId: String,
  num_like: Number,
  num_dislike: Number
}, { timestamps: true });

// export our module to use in server.js
module.exports = mongoose.model('Comment', CommentsSchema);
