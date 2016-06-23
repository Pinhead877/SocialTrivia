
module.exports = function(mongodb, errors) {
   var app = require('express');
   var router = app.Router();
   var monDB = mongodb.MongoClient;


   router.get('/list', function(req, res){
      res.render('questions/queslist');
   });

   //function to get all the questions in the DB
   //tat are PUBLIC!
   router.get('/list/:type', function(req, res){
      var type = req.params.type;
      monDB.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send({error: errors.DB_CONNECT_ERROR });
            db.close();
         }else{
            var quesCollection = db.collection('questions');
            var results;
            if(type == "public"){
               results = quesCollection.find({isPrivate: false});
            }
            else if(type == "private"){
               results = quesCollection.find({userid: req.session.userid});
            }
            else {
               db.close();
               return;
            }
            results.toArray(function(err, ques){
               res.send(ques);
               db.close();
            });
         }
      });
   });

   router.get('/add',function(req, res){
      res.render('questions/addques');
   })

   router.post('/create', function(req, res){
      var queObj = req.body;
      if(isTextInvalid(queObj.question, 6, 120)){
         res.send({error: errors.BAD_QUE});
         return;
      }
      if(isTextInvalid(queObj.answer, 4, 10)){
         res.send({error: errors.BAD_ANS});
         return;
      }
      var sess = req.session;
      if(!sess.userid){
         res.send({error: errors.DEV_ERROR});
         return;
      }
      monDB.connect(mongodb.urlToDB, function(err, db){
         if(err){
            console.error(err);
            res.send({error: errors.DB_CONNECT_ERROR });
         }else{
            var quesCollection = db.collection('questions');
            queObj.userid = sess.userid;
            quesCollection.insert(queObj);
            res.sendStatus(200);
         }
         db.close();
      });
   });

   return router;
}

/** ====================== Private Methods ====================== **/

function isTextInvalid(text, min, max){
   if(text===undefined || text === null) return true;
   if(text.length<min || text.length>max) return true;
   return false;
}
