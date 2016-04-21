var express = require('express');
var router = express.Router();

// TODO - delete this!!! Changes
router.get('/', function(req, res, next) {
  res.render('qpick', {});
});

router.get('/quescreen/:gameId/:queId', function(req, res){
  //TODO get the question from the DB or the server

  var params = {
    gameId: req.params.gameId,
    queId: req.params.queId,
    count: 5,
    que: "What is called a cat?"
  };

  res.render('quescreen',{params: params});
})

module.exports = router;
