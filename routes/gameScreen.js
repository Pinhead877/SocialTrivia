var express = require('express');
var router = express.Router();

router.get('/:gameid', function(req, res, next) {
  res.render('gamescreen', {});
});


// TODO - delete this!!!
router.get('/', function(req, res, next) {
  res.render('gamescreen', {});
});

module.exports = router;
