const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const ArchiveSessionSchema = new Schema({
    expertEmail           : {type: String, default: ''},
    userEmail             : {type: String, default: ''}, 
    archive_name          : {type: String, default: ''}, // name
    sessionId             : {type: String, default: ''}, // sessionId
    createdAt             : {type: String, default: ''}, // createdAt
    size                  : {type: String, default: ''}, // size
    duration              : {type: Number, default: 0}, // duration (in seconds)
    updatedAt             : {type: String, default: ''}, // updatedAt
    archiveId             : {type: String, default: ''}, // id
    archiveUrl            : {type: String, default: ''}, // url
    status                : {type: String, default: ''} // status
  });

module.exports = mongoose.model('ArchiveSession', ArchiveSessionSchema);
