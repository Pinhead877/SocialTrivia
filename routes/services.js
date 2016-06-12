
module.exports = function(io, mongodb) {
   var app = require('express');
   var router = app.Router();
   var async = require('asyncawait/async');
   var await = require('asyncawait/await');
   var monDB = mongodb.MongoClient;

   io.on('connection', function(socket){
      screenSocket = socket;
      console.log("screen connected");
      socket.on('room', function(gameId){
         socket.join(gameId);
      })
   });

   //Create new game - recieve a name from the client
   //than creates random game id and checks that it dosent apear in the DB
   //saves and sends to the client the _id, as it apears in the DB, the game name and the creators id
   router.post('/create/game', function(req, res){
      var gameName = req.body.name;
      var gameid;
      monDB.connect(mongodb.urlToDB, function(err, db){
         if(err){
            console.log("Error: "+err);
            res.send({ });
         }else{
            console.log("Connected To DB!");
            var data = db.collection("games");
            //create but still not use! an async function
            //to get the data from the DB
            var asyncFind = async(function(){
               return await(data.find({}));
            });
            //check for duplicate game id
            asyncFind().then(function(dataReturned){
               dataReturned.toArray(function(e,ids){
                  var checkID = true;
                  while(checkID){
                     gameid = Math.floor((Math.random()*999999999));
                     if(!isNumInArray(gameid, ids)){
                        checkID = false;
                     }
                  }
                  var respond = {
                     _id: gameid,
                     name: gameName,
                     dateCreated: new Date(),
                     creator: {
                        userid: req.session.userid,
                        nickname: req.session.nickname
                     }
                  };
                  data.insertOne(respond);
                  db.close();
                  res.send(respond);
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

   router.get('/session', function(req, res){
      if(req.session.nickname){
         res.send(req.session);
      }else{
         res.sendStatus(500);
      }
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
