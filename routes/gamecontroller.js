var express = require('express');
var router = express.Router();

// TODO - delete this!!! Changes
router.get('/', function(req, res, next) {
  res.render('qpick', {});
});

module.exports = router;
