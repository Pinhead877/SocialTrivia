// BASE /services
module.exports = function(io, db, errors) {
   var app = require('express');
   var router = app.Router();
   var async = require('asyncawait/async');
   var await = require('asyncawait/await');
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
               questions: req.body.questions.shuffle(),
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
                  res.send({gameid: gameid});
               }
            });
         });
      }).catch(function(e) {
         console.log(e);
         res.send(e);
      });
   });

   router.get('/endgame/:gameid', function(req, res){
      var gameID = parseInt(req.params.gameid);
      var gamesDB = db.collection('games');
      var usersDB = db.collection('users');
      gamesDB.findAndModify({_id: gameID},[],
         {$set: {isEnded: true} },
         function(err, result){
            if(err){
               console.log(errors.UNKNOWN);
               console.log(err);
            }
            res.sendStatus(200);
            var game = result.value;
            var winnerPlayer = _.maxBy(game.players, 'points');
            var tiePlayers = _.filter(game.players, {points: winnerPlayer.points});
            winnerPlayer = (tiePlayers.length>1) ? null : winnerPlayer;
            _.forEach(game.players, function(player){
               var correctAnswers = _.filter(game.questions, {answeredBy: player._id});
               var wrongAnswers = _.filter(game.questions, function(question){
                  if(question.answeredBy!=player._id && _.find(question.playersTried, {_id: player._id})!=null){
                     return question;
                  }
               });
               var incWinner = (winnerPlayer != null && player._id===winnerPlayer._id) ? 1 : 0;
               usersDB.updateOne(
                  {_id: new ObjectID(player._id)},
                  {
                     $inc:
                     {
                        points: player.points,
                        questionsAnswered: correctAnswers.length,
                        fullGamesPlayed: 1,
                        questionsWrong: wrongAnswers.length,
                        gamesWon: incWinner
                     },
                     $push:
                     { gamesLength: game.gameLength }
                  }
               );
            });
         }
      );
   });

   router.get('/session', function(req, res){
      if(req.session.nickname){
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
         });
      }else{
         res.send(errors.NO_SESSION);
      }
   });

   router.get('/gethighscores/:gameId', function(req, res){
      var gameID = parseInt(req.params.gameId);
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
      });
   });

   router.get('/getQuestionsStatuses/:gameId',function(req, res){
      var gameID = parseInt(req.params.gameId);
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
      });
   });

   router.get('/getEndedStats/:gameId', function(req, res){
      var gameID = parseInt(req.params.gameId);
      var gamesDB = db.collection('games');
      var gamesFound = gamesDB.find({_id: gameID});
      gamesFound.toArray(function(err, result){
         if(err){
            res.send(errors.UNKNOWN);
         }
         else if(result.length==0){
            res.send(errors.GAME_NUM_ERROR);
         }
         else{
            _.forEach(result[0].questions, function(question){
               delete question.answer;
               if(question.answeredBy!=null){
                  var player = _.find(result[0].players, {_id:question.answeredBy});
                  question.answeredBy = player.nickname;
               }
            });
            res.send(result[0]);
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

Array.prototype.shuffle = function() {
   var i = this.length, j, temp;
   if ( i == 0 ) return this;
   while ( --i ) {
      j = Math.floor( Math.random() * ( i + 1 ) );
      temp = this[i];
      this[i] = this[j];
      this[j] = temp;
   }
   return this;
}
