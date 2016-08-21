import mongoose from 'mongoose';

var SubArticleSchema = new mongoose.Schema({
  article_id: mongoose.Schema.ObjectId,
  subkeyword_id: mongoose.Schema.ObjectId
}, {collection: 'sub_article'});

export default mongoose.model('sub_article', SubArticleSchema);
