const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const AudiosessionSchema = new Schema({
    expertEmail           : {type: String, default: ''},
    userEmail             : {type: String, default: ''},
    username              : {type: String, default: ''},    
    sessionId             : {type: String, default: ''},
    sessionCreationDate   : {type: Date, default: Date.now()},
    sessionDuration       : {type: Number, default: 0},
    callStartTime         : {type: Date},
    callEndTime           : {type: Date},
    callStatus            : {type: String, enum: ['connecting', 'connected', 'completed', 'denied']}
});

module.exports = mongoose.model('Audiosession', AudiosessionSchema);
