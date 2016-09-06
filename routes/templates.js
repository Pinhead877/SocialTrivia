// BASE /templates

var express = require('express');
var router = express.Router();

/**
 * get the requseted template
 */
router.get('/:screen/:page', function(req, res, next) {
  res.render('templates/'+req.params.screen+'/'+req.params.page);
});

module.exports = router;
