// BASE /questions
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var request = require('request');

module.exports = function(mongodb, errors) {
   var app = require('express');
   var router = app.Router();
   var mongo = mongodb.MongoClient;
   var ObjectID = require('mongodb').ObjectID
   var _ = require('lodash');

   router.get('/list', function(req, res){
      res.render('questions/queslistpage');
   });

   //function to get all the questions in the DB
   //that PUBLIC!
   router.get('/list/:type', function(req, res){
      var type = req.params.type;
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            db.close();
         }else{
            var quesCollection = db.collection('questions');
            var results;
            if(type == "public"){
               results = quesCollection.find({$or: [{userid: req.session.userid}, {isPrivate: false}]});
            }
            else if(type == "private"){
               results = quesCollection.find({userid: req.session.userid});
            }
            else {
               db.close();
               return;
            }
            var resultUsers;
            results.toArray(function(err, ques){
               // TODO - Do only if type is public - if private use the creators name
               var userIds = [];
               for(var i=0;i<ques.length;i++){
                  var userId = ques[i].userid;
                  if(!isArrayContains(userIds, userId)){
                     userIds.push(new ObjectID(userId));
                  }
               }
               var usersCollection = db.collection('users');
               resultUsers = usersCollection.find({_id : {$in: userIds}});
               resultUsers.toArray(function(err, users){
                  for(var i=0;i<ques.length;i++){
                     ques[i].nickname = getUserObjectById(ques[i].userid, users).nickname;
                  }
                  res.send(ques);
                  db.close();
               });
            });
         }
      });
   });

   router.post('/delete', function (req, res) {
      var userID = req.session.userid, questionToDelete = req.body;
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }
         else{
            var quesDB = db.collection('questions');
            var quesFound = quesDB.find({_id: new ObjectID(questionToDelete._id)});
            quesFound.toArray(function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
                  db.close();
               }else{
                  if(result[0].userid==userID){
                     quesDB.deleteOne({_id: new ObjectID(questionToDelete._id)}, function(err, result){
                        if(err){
                           console.log(err);
                        }else {
                           res.sendStatus(200);
                        }
                        db.close();
                     });
                  }else{
                     db.close();
                  }
               }
            });
         }
      });
   });

   router.get('/add',function(req, res){
      res.render('questions/addques');
   })

   router.post('/create', function(req, res){
      var queObj = req.body;
      if(isTextInvalid(queObj.question, 6, 60)){
         res.send(errors.BAD_QUE);
         return;
      }
      if(isTextInvalid(queObj.answer, 2, 14)){
         res.send(errors.BAD_ANS);
         return;
      }
      var words = queObj.answer.split(" ");
      for(var i=0;i<words.length;i++){
         if(words[i].length>7){
            res.send(errors.WORD_LENGTH);
            return;
         }
      }
      if(queObj.category == null || queObj.category=={}){
         res.send(errors.NO_CATEGORY);
         return;
      }
      var sess = req.session;
      if(!sess.userid){
         res.send(errors.DEV_ERROR);
         return;
      }
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            console.error(err);
            res.send(errors.DB_CONNECT_ERROR);
         }else{
            var quesCollection = db.collection('questions');
            queObj.userid = sess.userid;
            quesCollection.insert(queObj);
            res.sendStatus(200);
         }
         db.close();
      });
   });

   router.post('/update', function(req, res){
      var que = req.body;
      if(isTextInvalid(que.question, 6, 120)){
         res.send(errors.BAD_QUE);
         return;
      }
      if(isTextInvalid(que.answer, 4, 10)){
         res.send(errors.BAD_ANS);
         return;
      }
      var sess = req.session;
      if(!sess.userid){
         res.sendStatus(403);
         return;
      }
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            console.error(err);
            res.send(errors.DB_CONNECT_ERROR);
         }else{
            var quesCollection = db.collection('questions');
            var queID = que._id;
            delete que._id;
            quesCollection.updateOne({_id: new ObjectID(queID)}, que, function(err, result){
               if(err){
                  res.send(errors.UNKNOWN);
                  console.log(err);
               }else if(result.result.n==0){
                  console.log(result);
               }else{
                  res.sendStatus(200);
               }
               db.close();
            });
         }
      });
   });

   router.get('/getCategories',function(req, res){
      mongo.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send(errors.DB_CONNECT_ERROR);
            return;
         }
         else{
            var categoryDB = db.collection("categories");
            var categoriesFound = categoryDB.find({});
            categoriesFound.toArray(function(err, result){
               if(err || result.length==0){
                  res.send(errors.UNKNOWN);
               }else{
                  res.send(_.orderBy(result, ['name']));
               }
               db.close();
            });
         }
      });
   });

   return router;
}

/** ====================== Private Methods ====================== **/
function getUserObjectById(userid, users){
   for(var i=0;i<users.length;i++){
      if(userid == users[i]._id) return users[i];
   }
   return null;
}
function isArrayContains(array, item){
   for(var j=0;j<array.length;j++){
      if(item == array[j]) return true;
   }
   return false;
}

function isTextInvalid(text, min, max){
   if(text===undefined || text === null) return true;
   if(text.length<min || text.length>max) return true;
   return false;
}
