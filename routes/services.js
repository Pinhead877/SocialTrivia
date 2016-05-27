module.exports = function(io, mongodb) {
   var app = require('express');
   var router = app.Router();
   var async = require('asyncawait/async');
   var await = require('asyncawait/await');
   var Promise = require('bluebird');
   var monDB = mongodb.MongoClient;

   var url = 'mongodb://127.0.0.1/socialdb';

   io.on('connection', function(socket){
      screenSocket = socket;
      console.log("screen connected");
      socket.on('room', function(gameId){
         socket.join(gameId);
      })
   });

   router.post('/create/game', function(req, res){
      var gameName = req.body.name;
      var gameid;
      monDB.connect(url, function(err, db){
         if(err){
            console.log("Error: "+err);
            res.send({ });
         }else{
            console.log("Connected To DB!");
            var data = db.collection("games");
            var asyncFind = async(function(){
               return await(data.find({}));
            });
            asyncFind().then(function(d){
               d.toArray(function(e,ids){
                  var checkID = true;
                  while(checkID){
                     gameid = Math.floor((Math.random()*9999999));
                     if(!isNumInArray(gameid, ids)){
                        checkID = false;
                     }
                  }
                  data.insertOne({_id:gameid, name: gameName});
                  db.close();
                  res.send({_id:gameid, name: gameName});
               });
            }).catch(function(e) {
               console.log(e);
               res.send(e);
            });
         }
      });
   });

   router.get('/:gameId/:queId',function(req, res){
      io.sockets.in(req.params.gameId).emit('selected', req.params.queId);
      res.sendStatus(200);
   });

   //TODO change to POST because of the many parameters
   router.get('/answers/:gameId/:queId/:answer',function(req, res){
      console.log("Answers");
      if(req.params.answer==1){
         res.send("Correct Answer");
         io.sockets.in(req.params.gameId).emit('correct', req.params.queId);
      }else{
         res.send("Wrong Answer");
         io.sockets.in(req.params.gameId).emit('wrong', req.params.queId);
      }
   });

   router.get('/back/:gameId/:queId', function(req, res){
      console.log('Back');
      io.sockets.in(req.params.gameId).emit('unanswered', req.params.queId);
   });


   return router;
}

var isNumInArray = function(num, arr){
   var t;
   arr.forEach(function(val,i,arr){
      if(parseInt(val._id) == num){
         t = true;
      }
   });
   if(t) return true;
   return false;
}
