

module.exports = function(){
   var express = require('express');
   var router = express.Router();

   router.get('/create',function(req, res){
      res.render('gameScreen/create');
   });

   router.get('/gamestart',function(req, res){
      console.log(req.session);
      res.render('gameScreen/gameStart', { game: req.session.gameid });
   });

   router.get('/:gameId', function(req, res, next) {
      res.render('gameScreen/gamescreen', {});
   });


   // TODO - delete this!!! Changes
   // router.get('/', function(req, res, next) {
   //   res.render('gamescreen', {});
   // });

   return router;
};
