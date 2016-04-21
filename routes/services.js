var express = require('express');
var router = express.Router();

router.get('/:game/:que',function(req, res){
  var gameId = req.params.game;
  var queId = req.params.que;

  //TODO socket here to paint the question on the screen

  res.sendStatus(200);
});

//TODO change to POST because of the many parameters
router.get('/answers/:gameId/:queId/:answer',function(req, res){
  if(req.params.answer==1){
    res.send("Correct Answer");
  }else{
    res.send("Wrong Answer");
  }
});

module.exports = router;
