import mongoose from 'mongoose';
mongoose.Promise = require('q').Promise;

var KeywordSchema = new mongoose.Schema({
  word: String,
  cnt: Number,
  date: String,
});

export default mongoose.model('keywords', KeywordSchema);
