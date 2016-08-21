/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	var _express = __webpack_require__(1);

	var _express2 = _interopRequireDefault(_express);

	var _morgan = __webpack_require__(2);

	var _morgan2 = _interopRequireDefault(_morgan);

	var _bodyParser = __webpack_require__(3);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	var _serveFavicon = __webpack_require__(4);

	var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

	var _router = __webpack_require__(5);

	var _router2 = _interopRequireDefault(_router);

	var _mongoose = __webpack_require__(9);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_mongoose2.default.connect('mongodb://localhost/politicat');

	var app = (0, _express2.default)();

	var port = 8000;
	app.use((0, _serveFavicon2.default)(__dirname + '/../public/favicon.ico'));
	app.use((0, _morgan2.default)('dev'));
	app.use(_bodyParser2.default.json());
	app.use(_bodyParser2.default.urlencoded({ extended: false }));
	app.use(_express2.default.static(__dirname + '/../public'));
	app.use('/', _router2.default);

	var server = app.listen(port, function () {
	  console.log('Express listening on port', port);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, "server"))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("morgan");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("serve-favicon");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _express = __webpack_require__(1);

	var _express2 = _interopRequireDefault(_express);

	var _keywordController = __webpack_require__(6);

	var _keywordController2 = _interopRequireDefault(_keywordController);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var router = _express2.default.Router();

	router.get('/home', _keywordController2.default.home);
	router.post('/search', _keywordController2.default.search);

	exports.default = router;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _q = __webpack_require__(7);

	var _q2 = _interopRequireDefault(_q);

	var _keyword = __webpack_require__(8);

	var _keyword2 = _interopRequireDefault(_keyword);

	var _keywordRelations = __webpack_require__(10);

	var _keywordRelations2 = _interopRequireDefault(_keywordRelations);

	var _keywordHelper = __webpack_require__(11);

	var _keywordHelper2 = _interopRequireDefault(_keywordHelper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Promisify a few mongoose methods with the `q` promise library
	var findKeyword = _q2.default.nbind(_keyword2.default.findOne, _keyword2.default);
	//import TodayKeyword from './model/todayKeyword.js';

	var findTodayKeyword = _q2.default.nbind(_keyword2.default.find, _keyword2.default);
	//var findTodayKeyword = Q.nbind(TodayKeyword.find, TodayKeyword);

	var api = {
	  search: function search(req, res, next) {
	    var root = req.body.data;

	    var relationsResult = [];
	    findKeyword({ keyword: root }).then(function (rootKeyword) {
	      if (rootKeyword) {
	        _keywordHelper2.default.findRelations(rootKeyword).then(function (results) {
	          results = results.sort(function (a, b) {
	            return b[b.length - 1] - a[a.length - 1];
	          });

	          var rootRelations = results.slice(0, 10);
	          rootRelations = rootRelations.map(function (val) {
	            var rootChildKeyword = val[0];
	            var rootChildCnt = val[1];

	            return findKeyword({ keyword: rootChildKeyword }).then(function (childKeywordObj) {
	              return _keywordHelper2.default.findRelations(childKeywordObj).then(function (results) {
	                results = results.sort(function (a, b) {
	                  return b[b.length - 1] - a[a.length - 1];
	                });

	                results = results.slice(0, 5);
	                results.forEach(function (val) {
	                  relationsResult.push([rootChildKeyword, val[0], rootChildCnt + val[1]]);
	                });
	              });
	            });
	          });

	          _q2.default.all(rootRelations).then(function () {
	            console.log('results: ', relationsResult);
	            res.send(relationsResult);
	          });
	        });
	      }
	    }).fail(function (error) {
	      next(error);
	    });
	  },

	  home: function home(req, res, next) {
	    var today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
	    findTodayKeyword({ date: today }).then(function (results) {
	      results = results.map(function (val) {
	        return [val.word, val.cnt];
	      });

	      console.log('results: ', results);
	      res.send(results);
	    });
	  }
	};

	exports.default = api;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("q");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(9);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var KeywordSchema = new _mongoose2.default.Schema({
	  word: String,
	  cnt: Number,
	  date: String
	});

	exports.default = _mongoose2.default.model('keywords', KeywordSchema);

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(9);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var KeywordRelationsSchema = new _mongoose2.default.Schema({
	  keyword1_id: _mongoose2.default.Schema.ObjectId,
	  keyword2_id: _mongoose2.default.Schema.ObjectId,
	  total_count: Number,
	  count_in_day: Number,
	  updated_at: Date
	});

	exports.default = _mongoose2.default.model('keyword_relations', KeywordRelationsSchema);

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _q = __webpack_require__(7);

	var _q2 = _interopRequireDefault(_q);

	var _keyword = __webpack_require__(8);

	var _keyword2 = _interopRequireDefault(_keyword);

	var _keywordRelations = __webpack_require__(10);

	var _keywordRelations2 = _interopRequireDefault(_keywordRelations);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var findKeyword = _q2.default.nbind(_keyword2.default.findOne, _keyword2.default);
	var findKeywordRelations = _q2.default.nbind(_keywordRelations2.default.find, _keywordRelations2.default);

	var api = {
	  // * input : keyword object ({keyword: '...', _id: '...'})
	  // * output : relation array [['keyword', 3(count)] , ... ]
	  findRelations: function findRelations(keyword) {
	    var relationsResult = [];
	    var relationsTemp = void 0;

	    // find by keyword1_id
	    return findKeywordRelations({ keyword1_id: keyword['_id'] }).then(function (relations) {
	      relationsTemp = relations;
	      var ids = relations.map(function (val) {
	        return findKeyword(val.keyword2_id);
	      });
	      return _q2.default.all(ids);
	    }).then(function (results) {
	      relationsTemp.forEach(function (val, i) {
	        relationsResult.push([results[i].keyword, relationsTemp[i].total_count]);
	      });
	      // find by keyword2_id
	      return findKeywordRelations({ keyword2_id: keyword['_id'] });
	    }).then(function (relations) {
	      relationsTemp = relations;
	      var ids = relations.map(function (val) {
	        return findKeyword(val.keyword1_id);
	      });
	      return _q2.default.all(ids);
	    }).then(function (results) {
	      relationsTemp.forEach(function (val, i) {
	        relationsResult.push([results[i].keyword, relationsTemp[i].total_count]);
	      });
	      return relationsResult;
	    });
	  }
	};

	exports.default = api;

/***/ }
/******/ ]);