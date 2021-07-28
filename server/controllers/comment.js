const mongoose = require('mongoose');

const Comment = require('../models/comment');
// const User = require('../models/user');

exports.getComments = (req, res) => {
  const { slug } = req.params;
  Comment.aggregate([
    {
      $match: { parentId: '-1', expert: slug }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: 'slug',
        as: 'users'
      }
    },

    { $sort: { createdAt: -1 } }
  ]).exec((err, comments) => {
    comments.forEach(async (val) => {
      const like_slugs = [];
      const dislike_slugs = [];
      val.voters.forEach((val2) => {
        like_slugs.push(val2.slug);
      });
      if (val.voters_dislikes) {
        val.voters_dislikes.forEach((val3) => {
          dislike_slugs.push(val3.slug);
        });
      }
      val.like_slugs = like_slugs;
      val.dislike_slugs = dislike_slugs;
    });

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
  });
};

exports.getReplies = (req, res) => {
  // const slug = req.params.slug;
  Comment.aggregate([
    {
      $match: { parentId: req.body.id }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: 'slug',
        as: 'users'
      }
    },

    { $sort: { createdAt: -1 } }
  ]).exec((err, comments) => {
    // console.log('replies');
    // console.log(comments);
    comments.forEach(async (val) => {
      const like_slugs = [];
      const dislike_slugs = [];
      val.voters.forEach((val2) => {
        like_slugs.push(val2.slug);
      });
      if (val.voters_dislikes) {
        val.voters_dislikes.forEach((val3) => {
          dislike_slugs.push(val3.slug);
        });
      }
      val.like_slugs = like_slugs;
      val.dislike_slugs = dislike_slugs;
    });

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
  });
};

exports.addComment = (req, res) => {
  const comment = new Comment();
  const {
    expert, author, text, parentId
  } = req.body;
  if (!author || !text || !parentId) {
    return res.json({
      success: false,
      error: { message: 'You must provide an author, comment and parentId' }
    });
  }
  comment.expert = expert;
  comment.author = author;
  comment.text = text;
  comment.parentId = parentId;
  return comment.save((err) => {
    if (err) {
      return res.json({
        success: false,
        error: err
      });
    }
    console.log('sssssssss');
    return res.json({
      success: true
    });
  });
};

exports.updateComment = (req, res) => {
  const { id, text } = req.body;
  if (!id) {
    return res.json({
      success: false,
      error: { message: 'No comment id provided' }
    });
  }
  return Comment.findById(id, (error, comment) => {
    if (error) {
      return res.json({
        success: false,
        error
      });
    }
    if (text) comment.text = text;
    return comment.save((err) => {
      if (err) {
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
};

exports.likeComment = (req, res) => {
  // console.log('like comment here ---');
  // console.log(req.body);
  // return false;
  const { id, author } = req.body;
  if (!id) {
    return res.json({
      success: false,
      error: { message: 'No comment id provided' }
    });
  }
  return Comment.findById(id, (error, comment) => {
    if (error) {
      return res.json({
        success: false,
        error
      });
    }
    const voter = comment.voters.find((element) => element.slug === author);
    if (voter === undefined || !voter) {
      comment.voters.push({ slug: author });
      comment.markModified('voters');
    } else {
      comment.voters = comment.voters.filter((element) => element.slug !== author);
    }
    comment.voters_dislikes = comment.voters_dislikes.filter((voters_dislike) => voters_dislike.slug !== author);
    return comment.save((err) => {
      if (err) {
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
};

exports.dislikeComment = (req, res) => {
  const { id, author } = req.body;
  if (!id) {
    return res.json({
      success: false,
      error: { message: 'No comment id provided' }
    });
  }
  return Comment.findById(id, (error, comment) => {
    if (error) {
      return res.json({
        success: false,
        error
      });
    }

    // var is_found = false;
    // comment.voters.forEach(function(item){
    //   if(item.slug==author){
    //     is_found = true;
    //     console.log('yes 1');
    //   }
    // })

    let is_found_2 = false;
    comment.voters_dislikes.forEach((item) => {
      if (item.slug === author) {
        is_found_2 = true;
      }
    });

    comment.voters = comment.voters.filter((voter) => voter.slug !== author);
    comment.voters_dislikes = comment.voters_dislikes.filter((voters_dislike) => voters_dislike.slug !== author);

    if (!is_found_2) {
      comment.voters_dislikes.push({ slug: author });
    }

    return comment.save((err) => {
      if (err) {
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
};

exports.deleteComment = (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.json({
      success: false,
      error: { message: 'No comment id provided' }
    });
  }
  return Comment.remove({
    $or: [{ _id: new mongoose.Types.ObjectId(id) },
      { parentId: id }]
  }, (error) => {
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
};
