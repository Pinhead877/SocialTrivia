

module.exports = function(){
   var express = require('express');
   var router = express.Router();

   router.get('/create',function(req, res){
      console.log("Create");
      res.render('gameScreen/create');
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
