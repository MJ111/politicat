import mongoose from 'mongoose';

var SubKeywordSchema = new mongoose.Schema({
  word: String,
  cnt: Number,
  keyword_id: mongoose.Schema.ObjectId
});

export default mongoose.model('subkeywords', SubKeywordSchema);
