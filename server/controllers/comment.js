const Comment = require('../models/comment')
const mongoose = require('mongoose');

exports.getComments = (req, res, next) => {
  Comment.aggregate([
    {
      $match: { parentId: '-1' }
    },
    {
      $project: {
        id:{ $toString:"$_id" },
        author: 1,
        text: 1,
        num_like: 1,
        num_dislike: 1
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "id",
        foreignField: "parentId",
        as: "replyList"
      }
    },
    {
      $group:{
       _id: "$_id",
       author: { $first:"$author" },
       text:{ $first:"$text" },
       num_like: { $first:"$num_like" },
       num_dislike: { $first:"$num_dislike" },
       answers: { $first:"$replyList" }
      }
    }
  ]).exec(
    (err, comments) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err
        });
      }
      return res.status(200).json({
        success: true,
        data: comments
      });
    }
  );
}

exports.addComment = (req, res, next) => {
  const comment = new Comment();
  const { author, text, parentId } = req.body;
  if (!author || !text || !parentId) {
    return res.json({
      success: false,
      error: { message: 'You must provide an author, comment and parentId' }
    });
  }
  comment.author = author;
  comment.text = text;
  comment.parentId = parentId;
  comment.num_like = 0;
  comment.num_dislike = 0;
  comment.save(err => {
    if (err) {
      return res.json({
        success: false,
        error: err
      });
    }
    return res.json({
      success: true
    });
  });
}

exports.updateComment = (req, res, next) => {
  const { text, updateId } = req.body;
  if (!updateId) {
    return res.json({
      success: false,
      error: { message: 'No comment id provided' }
    });
  }
  Comment.findById(updateId, (error, comment) => {
    if (error) {
      return res.json({
        success: false,
        error
      });
    }
    if (text) comment.text = text;
    comment.save(error => {
      if (error) {
        return res.json({
          success: false,
          error
        });
      }
      return res.json({
        success: true
      });
    });
  });
}

exports.updateLikeNum = (req, res, next) => {
  console.log(req.body);
  const { id, value } = req.body;
  if (!id) {
    return res.json({
      success: false,
      error: { message: 'No comment id provided' }
    });
  }
  Comment.findById(id, (error, comment) => {
    if (error) {
      return res.json({
        success: false,
        error
      });
    }
    if (value) {
      comment.num_like = value + 1;
    } else {
      comment.num_like = 1;
    }
    comment.save(error => {
      if (error) {
        return res.json({
          success: false,
          error
        });
      }
      return res.json({
        success: true
      });
    });
  });
}

exports.updateDislikeNum = (req, res, next) => {
  console.log(req.body);
  const { id, value } = req.body;
  if (!id) {
    return res.json({
      success: false,
      error: { message: 'No comment id provided' }
    });
  }
  Comment.findById(id, (error, comment) => {
    if (error) {
      return res.json({
        success: false,
        error
      });
    }
    if (value) {
      comment.num_dislike = value + 1;
    } else {
      comment.num_dislike = 1;
    }
    comment.save(error => {
      if (error) {
        return res.json({
          success: false,
          error
        });
      }
      return res.json({
        success: true
      });
    });
  });
}

exports.deleteComment = (req, res, next) => {
  const { id } = req.body;
  console.log("requested id: " + id);
  if (!id) {
    return res.json({
      success: false,
      error: { message: 'No comment id provided' }
    });
  }
  Comment.remove({ $or: [ { _id: new mongoose.Types.ObjectId(id) }, { parentId: id } ] }, (error, comment) => {
    if (error) {
      return res.json({
        success: false,
        error
      });
    }
    return res.json({
      success: true
    });
  });
}