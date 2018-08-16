const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const sessionpaymentSchema = new Schema({
    expertEmail       : {type: String, default: ''},
    userEmail         : {type: String, default: ''},
    sessionStatus     : {type: String, enum: ["ACTIVE","INACTIVE"]},
    paymentDate      : {type: Date, default: Date.now()},
    usedDuration      : {type: String, default: ''}, // in seconds
    amount            : {type: String, default: ''}, // in doller
    paymentStatus     : {type: String, default: ''},
    transactionId     : {type: String, default: ''},
    charge_id         : { type: String, default: '' }    
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('Sessionpayment', sessionpaymentSchema);
