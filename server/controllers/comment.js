const Comment = require('../models/comment');
const mongoose = require('mongoose');

exports.getComments = (req, res) => {
  const slug = req.params.slug;
  Comment.aggregate([
    {
      $match: { parentId: '-1', expert: slug }
    },
    {
      $project: {
        id: { $toString: '$_id' },
        author: 1,
        text: 1,
        voters: 1,
        updatedAt: 1
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: 'slug',
        as: 'users'
      }
    },
    {
      $lookup: {
        from: 'comments',
        let: {
          parent_id: '$id'
        },
        /* localField: "id",
        foreignField: "parentId", */
        pipeline: [{
          $project: {
            id: { $toString: '$_id' },
            parentId: 1,
            author: 1,
            text: 1,
            voters: 1,
            updatedAt: 1
          }
        }, {
          $match: { $expr: { $eq: ['$parentId', '$$parent_id'] } }
        }, {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: 'slug',
            as: 'users'
          }
        }, {
          $group: {
            _id: '$_id',
            authorId: { $first: '$author' },
            text: { $first: '$text' },
            voters: { $first: '$voters' },
            authorName: { $first: { $arrayElemAt: ['$users.profile', 0] } },
            profileImage: { $first: { $arrayElemAt: ['$users.profileImage', 0] } },
            updatedAt: { $first: '$updatedAt' }
          }
        }],
        as: 'answers'
      }
    },
    {
      $group: {
        _id: '$_id',
        authorId: { $first: '$author' },
        text: { $first: '$text' },
        voters: { $first: '$voters' },
        answers: { $first: '$answers' },
        authorName: { $first: { $arrayElemAt: ['$users.profile', 0] } },
        profileImage: { $first: { $arrayElemAt: ['$users.profileImage', 0] } },
        updatedAt: { $first: '$updatedAt' }
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
};

exports.addComment = (req, res) => {
  const comment = new Comment();
  const { expert, author, text, parentId } = req.body;
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
    const voter = comment.voters.find(voter => voter.slug === author);
    if (voter === undefined || !voter) {
      comment.voters.push({ slug: author });
      comment.markModified('voters');
    } else {
      comment.voters = comment.voters.filter(voter => voter.slug !== author);
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
    comment.voters = comment.voters.filter(voter => voter.slug != author);
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
  return Comment.remove({ $or: [{ _id: new mongoose.Types.ObjectId(id) },
     { parentId: id }] }, (error) => {
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
