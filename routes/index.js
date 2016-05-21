var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('mainScreen/index');
});

// router.get('/gamescreen', function(req, res, next) {
//   res.render('gamescreen', {});
// });

module.exports = router;
