// BASE /services
module.exports = function(io, mongodb, errors) {
   var app = require('express');
   var router = app.Router();
   var async = require('asyncawait/async');
   var await = require('asyncawait/await');
   var mongo = mongodb.MongoClient;
   var _ = require('lodash');
   var ObjectID = require('mongodb').ObjectID

   // Create new game - recieve a name from the client
   // than creates random game id and checks that it dosent apear in the DB
   // saves and sends to the client the _id,
   // as it apears in the DB, the game name and the creators id
   router.post('/create/game', function(req, res){
      var gameName = req.body.name;
      var gameLength = req.body.minutes;
      if(req.body.questions == null || req.body.questions.length==0){
         res.send(errors.NO_QUES);
         return;
      }
      if(gameName==null || gameName==""){
         res.send(errors.NO_GAME_NAME);
         return;
      }
      if(gameLength==null || gameLength<=0){
         gameLength = 3*req.body.questions.length;
      }
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
                  var gameToCreate = {
                     _id: gameid,
                     name: gameName,
                     questions: req.body.questions,
                     isStarted: false,
                     isEnded: false,
                     dateCreated: new Date(),
                     creator: {
                        userid: req.session.userid,
                        nickname: req.session.nickname
                     },
                     gameLength: gameLength
                  };
                  gamesDB.insertOne(gameToCreate, function(err, result){
                     if(err){
                        console.error(err);
                        res.send(errors.CREATING_GAME);
                     }else{
                     db.close();
                     res.send({gameid: gameid});
                  }
                  });
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
            var usersDB = db.collection('users');
            gamesDB.findAndModify({_id: gameID},[],
               {$set: {isEnded: true} },
               function(err, result){
                  if(err){
                     console.log(errors.UNKNOWN);
                     console.log(err);
                  }
                  console.log("endgame");
                  console.log(result.value.players);
                  _.forEach(result.value.players, function(player){
                     usersDB.updateOne({_id: new ObjectID(player._id)}, {$inc: {points: player.points}});
                  });
               }
            );
         }
      });
   });

   router.get('/session', function(req, res){
      if(req.session.nickname){
         mongo.connect(mongodb.urlToDB, function(err, db){
            if(err){
               res.send(errors.DB_CONNECT_ERROR);
               return;
            }
            else{
               var usersDB = db.collection("users");
               var usersFound = usersDB.find({_id: new ObjectID(req.session.userid)});
               usersFound.toArray(function(err, result){
                  if(err){
                     res.send(errors.UNKNOWN);
                  }else{
                     req.session.points = result[0].points;
                     req.session.save();
                     res.send(req.session);
                  }
                  db.close();
               });
            }
         });
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
                     res.send(result[0].players.slice(0,5));
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
