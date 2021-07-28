const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentsSchema = new Schema({
  author: String,
  expert: String,
  name: String,
  text: String,
  parentId: String,
  voters: [
    {
      slug: String,
      createdAt: { type: Date, default: Date.now() }
    }
  ],
  voters_dislikes: [
    {
      slug: String,
      createdAt: { type: Date, default: Date.now() }
    }
  ]
}, {
  timestamps: true,
  usePushEach: true
});

// export our module to use in server.js
module.exports = mongoose.model('Comment', CommentsSchema);
