

module.exports = function(){
  var express = require('express');
  var router = express.Router();

  router.get('/:gameId', function(req, res, next) {
    res.render('gamescreen', {});
  });


  // TODO - delete this!!! Changes
  // router.get('/', function(req, res, next) {
  //   res.render('gamescreen', {});
  // });

  return router;
};
