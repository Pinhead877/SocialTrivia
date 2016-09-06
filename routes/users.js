// BASE /users

module.exports = function(db, errors) {
   var express = require('express');
   var router = express.Router();
   var ObjectID = require('mongodb').ObjectID

   // example on how to get the params from the url
   // router.get('/profile', function(req, res, next) {
   //    // console.log(req.query); get variables from the url
   //    res.render('profile/profilescreen');
   // });

   /**
    * DECREPTED
    */
   router.get('/gamelist/', function(){
      res.render('profile/usergames');
   });

   /**
    * creates new user in the db
    */
   router.post('/create', function(req, res){
      //TODO - add validation check if empty and check length
      var userDetails = req.body;
      if(!isNicknameValid(userDetails.nickname))
      {
         res.send(errors.NICKNAME);
         return;
      }
      if(!isStringValid(userDetails.password))
      {
         res.send(errors.PASSWORD);
         return;
      }
      if(!isStringValid(userDetails.gender))
      {
         res.send(errors.UNKNOWN);
         return;
      }
      if(isEmptyOrUndefined(userDetails.birthday))
      {
         res.send(errors.UNKNOWN);
         return;
      }
      var data = db.collection("users");
      var userFound = data.find({
         nickname: generateRegExp(userDetails.nickname)
      });
      userFound.toArray(function(e,user){
         if(user.length>0){
            res.send(errors.USER_EXISTS);
         }
         else{
            userDetails.points = 0;
            userDetails.questionsAnswered = 0;
            userDetails.fullGamesPlayed = 0;
            userDetails.questionsWrong = 0;
            userDetails.gamesLength = [];
            var ins = data.insert(userDetails);
            res.sendStatus(200);
         }
      });
   });

   /**
    * get the high scores for the high scores page
    */
   router.get("/gethighscores", function(req, res){
      var usersDB = db.collection("users");
      var usersFound = usersDB.find({});
      usersFound.sort({"points": -1});
      usersFound.limit(100);
      usersFound.toArray(function(err, result){
         if(err){
            res.send(errors.UNKNOWN);
         }
         else{
            res.send(result);
         }
      });
   });

   /**
    * logins a user to the game
    */
   router.post('/login', function(req, res){
      var data = db.collection("users");
      var user = data.find({
         nickname: generateRegExp(req.body.nickname),
         password: req.body.password
      });
      user.toArray(function(e,user) {
         if(e) console.log("error");
         if(user.length === 0){
            res.send(errors.BAD_LOGIN);
         }
         else if(user.length===1){
            var sess = req.session;
            sess.nickname = user[0].nickname;
            sess.userid = user[0]._id;
            sess.points = user[0].points;
            res.sendStatus(200);
         }
      });
   });

   /**
    * logs out a user from the game
    */
   router.get('/logout', function(req, res){
      req.session.destroy(function(err){
         if(err){
            console.error(err);
            return;
         }
      });
      res.render('mainScreen/index');
   });

   return router;
}

/** ====================== Private Methods ====================== **/
/**
 * generates a regex expression of the given text
 */
function generateRegExp(text) {
   return new RegExp(["^",text,"$"].join(""), "i");
}

/**
 * nickname validation
 */
function isNicknameValid(text) {
   if(isLengthInvalid(text)) return false;
   if(!isStringValid(text)) return false;
   return true;
}

/**
 * text length validatino
 */
function isLengthInvalid(text){
   if(text.length<4 || text.length>10) return true;
   return false;
}

/**
 * general string validation
 */
function isStringValid(text){
   if(isEmptyOrUndefined(text)) return false;
   if(!isStringConatainsNumbersAndLetters(text)) return false;
   return true;
}

/**
 * checks if an item is empty, undefined or null
 */
function isEmptyOrUndefined(item){
   if(item==="" || item == null) return true;
   return false;
}

/**
 * checks if a text is only letters and numbers
 */
function isStringConatainsNumbersAndLetters(inputtxt){
   //RegExp of letters and Numbers
   var letterNumber = /([a-z]|[A-Z]|[0-9])/g;
   if(inputtxt.match(letterNumber)==null || inputtxt.match(letterNumber).length<inputtxt.length) return false;
   return true;
}
