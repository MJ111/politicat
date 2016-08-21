import Q from 'q';
import Keyword from './model/keyword.js';
import SubKeyword from './model/subkeyword.js';
import SubArticle from './model/subarticle.js';
import Article from './model/article.js';

// Promisify a few mongoose methods with the `q` promise library
var findTodayKeyword = Q.nbind(Keyword.find, Keyword);
var findOneKeyword = Q.nbind(Keyword.findOne, Keyword);
var findSubKeyword = Q.nbind(SubKeyword.find, SubKeyword);
var findOneSub = Q.nbind(SubKeyword.findOne, SubKeyword);
var findSubArticle = Q.nbind(SubArticle.find, SubArticle);
var findArticle = Q.nbind(Article.find, Article);

var api = {
  article: function(req, res, next) {
    const subkeyword = req.body.data;
    findOneSub({word:subkeyword})
    .then((result) => {
      console.log('result', result)
      return findSubArticle({subkeyword_id:result._id})
    })
    .then((results) => {
      console.log('results', results)
      return Q.all(results.map((val) => {
        return findArticle({_id:val.article_id})
      }))
    })
    .then((results) => {
      console.log('results2', results)
      res.send(results)
    })
  },

  sub: function(req, res, next) {
    const today = req.body.data;
    findOneKeyword({word:today})
    .then((result) => {
      console.log('result', result)
      return findSubKeyword({keyword_id:result._id})
    })
    .then((results) => {
      console.log('results', results)
      res.send(results);
    })
  },

  today: function(req, res, next) {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    findTodayKeyword({date: today})
    .then(function(results) {
      results = results.map(function(val) {
        return [val.word, val.cnt];
      });

      console.log('results: ', results);
      res.send(results);
    });
  }
};

export default api;
