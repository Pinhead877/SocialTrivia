module.exports = function(mongodb, errors) {
   var express = require('express');
   var router = express.Router();
   var mondb = mongodb.MongoClient;

   router.get('/profile', function(req, res, next) {
      res.render('profile/profilescreen');
   });

   router.post('/create', function(req, res){
      //TODO - add validation check if empty and check length
      var userDetails = req.body;
      if(isObjectInvalid(userDetails, res)){
         res.send({error: errors.DEV_ERROR});
         return;
      }
      mondb.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send({error: errors.DB_CONNECT_ERROR});
            return;
         }
         var data = db.collection("users");
         var user = data.find({
            nickname: generateRegExp(userDetails.nickname)
         });
         user.toArray(function(e,user){
            if(user.length>0){
               res.send({error: errors.USER_EXISTS});
            }else{
               var ins = data.insert(userDetails);
               res.sendStatus(200);
            }
         });
      });
   });

   router.post('/login', function(req, res){
      mondb.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send({error: errors.DB_CONNECT_ERROR});
            return;
         }
         var data = db.collection("users");
         var user = data.find({
            nickname: generateRegExp(req.body.nickname),
            password: req.body.password
         });
         user.toArray(function(e,user) {
            if(user.length === 0){
               res.send({error: errors.BAD_LOGIN});
            }else if(user.length===1){
               var sess = req.session;
               sess.nickname = user[0].nickname;
               sess.userid = user[0]._id;
               res.sendStatus(200);
            }
         });
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

function generateRegExp(text) {
   return new RegExp(["^",text,"$"].join(""), "i");
}

function isObjectInvalid(obj, res) {
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
   console.log(text);
   console.log("isStringValid");
   if(isEmptyOrUndefined(text)) return false;
   console.log("Passed - isEmptyOrUndefined");
   if(!isStringConatainsNumbersAndLetters(text)) return false;
   console.log("Passed - isStringConatainsNumbersAndLetters");
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
