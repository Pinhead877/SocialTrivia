// BASE /services
module.exports = function(io, mongodb, errors) {
   var app = require('express');
   var router = app.Router();
   var async = require('asyncawait/async');
   var await = require('asyncawait/await');
   var mongo = mongodb.MongoClient;
   var _ = require('lodash');

   //Create new game - recieve a name from the client
   //than creates random game id and checks that it dosent apear in the DB
   //saves and sends to the client the _id, as it apears in the DB, the game name and the creators id
   router.post('/create/game', function(req, res){
      if(req.body.questions == null || req.body.questions.length==0){
         res.send(errors.NO_QUES);
         return;
      }
      var gameName = req.body.name;
      var gameid;
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            console.log(err);
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }else{
            var gamesDB = db.collection("games");
            //declare but not use! the async function
            //used to get the data from the DB
            var asyncFind = async(function(){
               return await(gamesDB.find({}));
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
                     questions: req.body.questions,
                     dateCreated: new Date(),
                     creator: {
                        userid: req.session.userid,
                        nickname: req.session.nickname
                     },
                     gameLength: req.body.minutes
                  };
                  gamesDB.insertOne(respond);
                  res.sendStatus(200);
                  req.session.gameid = gameid;
                  req.session.save(function(err){
                     if(err){
                        console.log("Error saving session!");
                     }
                  });
                  db.close();
               });
            }).catch(function(e) {
               console.log(e);
               res.send(e);
            });
         }
      });
   });

   router.get('/endgame/:gameid', function(req, res){
      var gameID = parseInt(req.params.gameid);
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }
         else{
            var gamesDB = db.collection('games');
            gamesDB.updateOne({_id: gameID},
               {$set: {isEnded: true} },
               function(err, result){
                  if(err){
                     console.log(errors.UNKNOWN);
                     console.log(err);
                  }else if(result.result.n==0){
                     console.log(errors.DB_OPERATION);
                     console.log(result.result);
                  }
                  db.close();
               }
            );
         }
      });
   });

   router.get('/session', function(req, res){
      if(req.session.nickname){
         res.send(req.session);
      }else{
         res.send(errors.NO_SESSION);
      }
   });

   router.get('/gethighscores/:gameId', function(req, res){
      var gameID = parseInt(req.params.gameId);
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }
         else{
            var gamesDB = db.collection('games');
            var gamesFound = gamesDB.find({_id: gameID});
            gamesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
               }else{
                  if(result.length==0){
                     res.send(errors.UNKNOWN);
                  }else{
                     result[0].players.sort(function(a,b){
                        return b.points - a.points;
                     });
                     res.send(result[0].players);
                  }
               }
               db.close();
            });
         }
      });
   });

   router.get('/getQuestionsStatuses/:gameId',function(req, res){
      var gameID = parseInt(req.params.gameId);
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }
         else{
            var gamesDB = db.collection('games');
            var gamesFound = gamesDB.find({_id: gameID});
            gamesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
               }else{
                  res.send(_.map(result[0].questions, function(stat){
                     if(stat.statusColor) return stat.statusColor;
                     else return 'unanswered';
                  }));
               }
               db.close();
            });
         }
      });
   });

   return router;
}

/**     Private Methods    **/

//function to check if a number is in a given array
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
