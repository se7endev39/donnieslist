const mongoose = require('mongoose'), Schema = mongoose.Schema, ObjectId = Schema.Types.ObjectId;

const VideosessionSchema = new Schema({
    expertEmail               : {type: String, default: ''},
    userEmail                 : {type: String, default: ''},
    sessionCompletionStatus   : {type: String, enum: ["COMPLETED","UNCOMPLETED"], default: 'UNCOMPLETED'},
    sessionCreationDate       : {type: Date, default: Date.now()},
    sessionPaymentId          : {type : ObjectId}
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('Videosession', VideosessionSchema);
