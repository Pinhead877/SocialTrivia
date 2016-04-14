var express = require('express');
var router = express.Router();

router.get('/:gameid', function(req, res, next) {
  res.render('gamescreen', {});
});

module.exports = router;
