const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const sessionmessagesSchema = new Schema({
    sessionOwnerUsername    : {type: String, required: true},
    messageReceiverFullName:  {type: String },
    messageReceiverEmail:    	{type: String, required: true},

    messageSenderFullName:    {type: String },
    messageSenderEmail:      	{type: String, required: true},

    message:                  {type: String, required: true},
    messageTime:              {type: Date},

    is_seen:                  {type: Boolean, default: false}
});
module.exports = mongoose.model('Sessionmessages', sessionmessagesSchema);
