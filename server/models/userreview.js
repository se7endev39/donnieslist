const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const UserReviewSchema = new Schema({
    expertEmail               : {type: String, default: ''},
    expertFullName            : {type: String, default: ''},
    expertSlug                : {type: String, default: ''},
    userEmail                 : {type: String, default: ''},
    userFullName              : {type: String, default: ''},
    rating                    : {type: Number, default: 0 },
    review                    : {type: String, default: ''},
    title                     : {type: String, default: ''},
    reviewBy                  : {type: String, default: ''},
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('UserReview', UserReviewSchema);
