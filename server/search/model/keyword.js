import mongoose from 'mongoose';

var KeywordSchema = new mongoose.Schema({
  word: String,
  cnt: Number,
  date: String,
});

export default mongoose.model('keywords', KeywordSchema);
