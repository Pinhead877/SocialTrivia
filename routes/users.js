// BASE /users

module.exports = function(db, errors) {
   var express = require('express');
   var router = express.Router();

   //TODO - example on how to get the params from the url
   router.get('/profile', function(req, res, next) {
      // console.log(req.query); get variables from the url
      res.render('profile/profilescreen');
   });

   router.get('/gamelist/', function(){
      res.render('profile/usergames');
   });

   // router.post('/list', function(req, res){
   //    console.log(req.body);
   // });

   router.post('/create', function(req, res){
      //TODO - add validation check if empty and check length
      var userDetails = req.body;
      if(isObjectInvalid(userDetails)){
         res.send(errors.DEV_ERROR);
         return;
      }
      var data = db.collection("users");
      var userFound = data.find({
         nickname: generateRegExp(userDetails.nickname)
      });
      userFound.toArray(function(e,user){
         if(user.length>0){
            res.send(errors.USER_EXISTS);
         }else{
            userDetails.points = 0;
            var ins = data.insert(userDetails);
            res.sendStatus(200);
         }
      });
   });

   router.get("/gethighscores", function(req, res){
      var usersDB = db.collection("users");
      var usersFound = usersDB.find({});
      usersFound.sort({"points": -1});
      usersFound.limit(100);
      usersFound.toArray(function(err, result){
         if(err){
            res.send(errors.UNKNOWN);
         }else{
            res.send(result);
         }
      });
   });

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
         }else if(user.length===1){
            var sess = req.session;
            sess.nickname = user[0].nickname;
            sess.userid = user[0]._id;
            sess.points = user[0].points;
            res.sendStatus(200);
         }
      });
   });

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
function generateRegExp(text) {
   return new RegExp(["^",text,"$"].join(""), "i");
}

//TODO - send errors with the right info to the client
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
