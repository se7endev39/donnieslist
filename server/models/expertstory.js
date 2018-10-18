const mongoose    = require('mongoose');
const Schema = mongoose.Schema;

const ExpertStorySchema = new Schema({
    status  : { type: String, default:''},
    video   : { videoURL:{ type: String, default: '', required: true }, duration:{ type:Number, required: true }, screenshotURL:{ type: String, default: '', required: true }, size:{  type:Number, required: true } },
    expert: { name:{ firstName: { type: String }, lastName: { type: String, default: '' } }, profileImage:{ type: String, default:''}, email:{ type: String, lowercase: true, unique: true, required: true } },
    timestamps:{ createdAt:{ type: String, default: '' }, updatedAt:{ type: String, default: '' } }
});

module.exports = mongoose.model('ExpertStory', ExpertStorySchema);