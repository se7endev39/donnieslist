// Importing Node packages required for schema
const mongoose = require('mongoose');

const { Schema } = mongoose;

//= ===============================
// expert signup token Schema
//= ===============================
const ExpertSignupToken = new Schema({
  email: { type: String, lowercase: true, required: true },
  token: { type: String },
  tokenExpires: { type: Date }
},
{
  timestamps: true
});

module.exports = mongoose.model('ExpertSignupToken', ExpertSignupToken);
