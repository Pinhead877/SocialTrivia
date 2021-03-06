module.exports = function(db, errors) {
   var express = require('express');
   var router = express.Router();
   var _ = require('lodash');
   var ObjectID = require('mongodb').ObjectID

   /**
    * shows the profile page
    */
   router.get('/', function(req, res){
      res.render('profile/profilescreen');
   });

   /**
    * shows the edit profile page
    */
   router.get('/editProfile/', function(req, res){
      res.render('profile/editprofile');
   });

   /**
    * shows the user games page
    */
   router.get('/games/', function(req, res){
      res.render('profile/usergames');
   });

   /**
    * shows the user question page
    */
   router.get('/questions/', function(req, res){
      res.render('profile/userquestions');
   });

   /**
    * returns an array of the current user games
    */
   router.get('/getGames',function(req, res){
      var userID = req.session.userid;
      var gamesDB = db.collection('games');
      var gamesFound = gamesDB.find({'creator.userid': userID});
      gamesFound.toArray(function(err, result){
         if(err){
            res.send(errors.UNKNOWN);
         }
         else{
            _.sortBy(result, ['isStarted']);
            res.send(result.reverse());
         }
      });
   });

   /**
    * return the current user details with statistics
    */
   router.get('/getPlayerDetails', function(req, res){
      var userID = req.session.userid;
      var playerDB = db.collection('users');
      var gamesDB = db.collection('games');
      var gamesFound = gamesDB.find({"creator.userid": userID});
      var questionsDB = db.collection('questions');
      var questionsFound = questionsDB.find({userid: userID});
      var playersFound = playerDB.find({_id: new ObjectID(userID)});
      playersFound.toArray(function(err, result){
         if(err || result[0]==null){
            res.send(errors.UNKNOWN);
         }
         else{
            delete result[0].password;
            gamesFound.toArray(function(err, gamesResult){
               if(err){
                  res.send(errors.UNKNOWN);
               }
               else{
                  questionsFound.toArray(function(err, questionsResult){
                     if(err){
                        res.send(errors.UNKNOWN);
                     }
                     else{
                        var ageInMilli = new Date()-new Date(result[0].birthday);
                        result[0].age = getYearsFromMilli(ageInMilli);
                        result[0].gamesCreated = gamesResult.length;
                        result[0].questionsCreated = questionsResult.length;
                        res.send(result[0]);
                     }
                  });
               }
            });
         }
      });
   });

   /**
    * get the user details for the edit page
    */
   router.get('/getUser', function(req, res){
      var userID = req.session.userid;
      var usersDB = db.collection("users");
      var usersFound = usersDB.find({_id: new ObjectID(userID)});
      usersFound.toArray(function(err, result){
         if(err){
            res.send(errors.UNKNOWN);
         }
         else if(result.length==0){
            return;
         }
         else{
            delete result[0].password;
            res.send(result[0]);
         }
      });
   });

   /**
    * updates the user in the DB
    */
   router.post('/putUser', function(req, res){
      var userID = req.session.userid;
      var usersDB = db.collection("users");
      var userToUpdate = {};
      if(req.body.password!=null){
         userToUpdate.password = req.body.password;
      }
      if(req.body.gender==null || req.body.birthday==null){
         res.sendStatus(401);
         return;
      }
      userToUpdate.gender = req.body.gender;
      userToUpdate.birthday = req.body.birthday;
      usersDB.updateOne({_id: new ObjectID(userID)}, {$set: userToUpdate} ,function(err, result){
         if(err){
            res.send(errors.UNKNOWN);
            console.log(err);
         }
         else if(result.result.n==0){
            console.log(result);
         }
         else{
            res.sendStatus(200);
         }
      });
   });

   return router;
}

/** ** ** ** ** Private Methods ** ** ** ** **/

/**
 * convert milliseconds to years
 */
function getYearsFromMilli(time){
   time=Math.floor(time/1000);
   return Math.floor(time/31536000);
}
