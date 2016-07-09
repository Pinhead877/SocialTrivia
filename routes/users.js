module.exports = function(mongodb, errors) {
   var express = require('express');
   var router = express.Router();
   var mondb = mongodb.MongoClient;

   router.get('/profile', function(req, res, next) {
      res.render('profile/profilescreen');
   });

   //TODO - send the userid and name of the requested ids
   //TODO - example on how to get the params from the url
   router.get('/loggedToGameList', function(req, res){
      // console.log(req.query); get variables from the url
      var gameid = req.session.gameid;
      mondb.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }else{
            var gamesDB = db.collection('games');
            var gamesFound = gamesDB.find({ _id: gameid});
            gamesFound.toArray(function(err, games){
               if(err){
                  res.send(errors.UNKNOWN);
               }else{
                  if(games.length===0){
                     res.send(errors.UNKNOWN);
                  }else{
                     var playersToSend = [];
                     if(games[0].players){
                        var playersInGame = games[0].players;
                        for (var i = 0; i < playersInGame.length; i++) {
                           playersToSend[i] = playersInGame[i];
                        }
                     }
                     res.send(playersToSend);
                  }
               }
               db.close();
            });
         }
      });

   });

   router.post('/list', function(req, res){
      console.log(req.body);
   })

   router.post('/create', function(req, res){
      //TODO - add validation check if empty and check length
      var userDetails = req.body;
      if(isObjectInvalid(userDetails)){
         res.send(errors.DEV_ERROR);
         return;
      }
      mondb.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
         }else{
            var data = db.collection("users");
            var user = data.find({
               nickname: generateRegExp(userDetails.nickname)
            });
            user.toArray(function(e,user){
               if(user.length>0){
                  res.send(errors.USER_EXISTS);
               }else{
                  var ins = data.insert(userDetails);
                  res.sendStatus(200);
               }
               db.close();
            });
         }
      });
   });

   router.post('/login', function(req, res){
      mondb.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
         }else{
            var data = db.collection("users");
            var user = data.find({
               nickname: generateRegExp(req.body.nickname),
               password: req.body.password
            });
            user.toArray(function(e,user) {
               if(e) console.log("error");
               if(user.length === 0){
                  res.send(errors.BAD_LOGIN);
               }else if(user.length===1){
                  var sess = req.session;
                  sess.nickname = user[0].nickname;
                  sess.userid = user[0]._id;
                  res.sendStatus(200);
               }
               db.close();
            });
         }
      });

   });

   router.get('/logout', function(req, res){
      req.session.destroy(function(err){
         if(err){
            res.sendStatus(500);
            return;
         }
      });
      res.sendStatus(200);
   });

   return router;
}

/** ====================== Private Methods ====================== **/
function generateRegExp(text) {
   return new RegExp(["^",text,"$"].join(""), "i");
}

function isObjectInvalid(obj) {
   if(!isNicknameValid(obj.nickname)) return true;
   if(!isStringValid(obj.password)) return true;
   if(isEmptyOrUndefined(obj.gender)) return true;
   if(isEmptyOrUndefined(obj.birthday)) return true;
   return false;
}

function isNicknameValid(text) {
   if(isLengthInvalid(text)) return false;
   if(!isStringValid(text)) return false;
   return true;
}

function isLengthInvalid(text){
   if(text.length<4 || text.length>10) return true;
   return false;
}

function isStringValid(text){
   if(isEmptyOrUndefined(text)) return false;
   if(!isStringConatainsNumbersAndLetters(text)) return false;
   return true;
}

function isEmptyOrUndefined(item){
   if(item==="" || item===undefined || item===null) return true;
   return false;
}

function isStringConatainsNumbersAndLetters(inputtxt){
   //RegExp of letters and Numbers
   var letterNumber = /([a-z]|[A-Z]|[0-9])/g;
   if(inputtxt.match(letterNumber).length<inputtxt.length) return false;
   return true;
}

// function pause(milliseconds) {
// 	var dt = new Date();
// 	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
// }
