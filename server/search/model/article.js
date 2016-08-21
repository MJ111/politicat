import mongoose from 'mongoose';

var ArticleSchema = new mongoose.Schema({
});

export default mongoose.model('articles', ArticleSchema);
