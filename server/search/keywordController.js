import Q from 'q';
import Keyword from './model/keyword.js';
import SubKeyword from './model/subkeyword.js';
import SubArticle from './model/subarticle.js';
import Article from './model/article.js';

// Promisify a few mongoose methods with the `q` promise library
const findOneKeyword = Q.nbind(Keyword.findOne, Keyword);
const findSubKeyword = Q.nbind(SubKeyword.find, SubKeyword);
const findOneSub = Q.nbind(SubKeyword.findOne, SubKeyword);
const findSubArticle = Q.nbind(SubArticle.find, SubArticle);
const findArticle = Q.nbind(Article.find, Article);

let today = new Date().toLocaleDateString('ko-KR',
  {year:'numeric', month:'2-digit', day:'2-digit'}).replace(/\//g, '');
today = today.slice(4)+today.slice(0,2)+today.slice(2,4);

const api = {
  article: function(req, res, next) {
    const mainKeyword = req.body.main;
    const subKeyword = req.body.sub;
    findOneKeyword({word:mainKeyword, date:today})
    .then((result) => {
      console.log('result', result)
      return findOneSub({word:subKeyword, keyword_id:result._id})
    })
    .then((result) => {
      console.log('sub result', result)
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
    const mainKeyword = req.body.data;
    findOneKeyword({word:mainKeyword, date:today})
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
    console.log(today)
    Keyword.find({date: today})
    .sort({cnt:-1})
    .then(function(results) {
      console.log('results: ', results);
      results = results.map(function(val) {
        return [val.word, val.cnt];
      });

      res.send(results);
    });
  }
};

export default api;
