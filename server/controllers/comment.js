const Comment = require('../models/comment')

exports.getComments = (req, res, next) => {
  Comment.find((err, Comment) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err
      });
    }
    return res.status(200).json({
      success: true,
      data: Comment
    });
  });
}

exports.addComment = (req, res, next) => {
  const comment = new Comment();
  const { author, text } = req.body;
  if (!author || !text) {
    return res.json({
      success: false,
      error: { message: 'You must provide an author and comment' }
    });
  }
  comment.author = author;
  comment.text = text;
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
  console.log(req.params);
  const { commentId } = req.params;
  if (!commentId) {
    return res.json({
      success: false,
      error: { message: 'No comment id provided' }
    });
  }
  Comment.findById(commentId, (error, comment) => {
    if (error) {
      return res.json({
        success: false,
        error
      });
    }
    const { author, text } = req.body;
    if (author) comment.author = author;
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

exports.deleteComment = (req, res, next) => {
  const { commentId } = req.params;
  if (!commentId) {
    return res.json({
      success: false,
      error: { message: 'No comment id provided' }
    });
  }
  Comment.remove({ _id: commentId }, (error, comment) => {
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