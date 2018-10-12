const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const CommentsSchema = new Schema({
  author: String,
  text: String,
}, { timestamps: true });

// export our module to use in server.js
module.exports = mongoose.model('Comment', CommentsSchema);
