// BASE /templates

var express = require('express');
var router = express.Router();


router.get('/:screen/:page', function(req, res, next) {
  res.render('templates/'+req.params.screen+'/'+req.params.page);
});

module.exports = router;
