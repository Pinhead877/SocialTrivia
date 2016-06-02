
module.exports = function(mongodb) {
   var app = require('express');
   var router = app.Router();
   var monDB = mongodb.MongoClient;


   //function to get all the questions in the DB
   //tat are PUBLIC!
   router.get('/', function(req, res){
      monDB.connect(mongodb.urlToDB, function(err, db){
         if(err){
            console.log("Error: "+err);
            res.send({error: "database connection error" });
         }else{
            var quesCollection = db.collection('questions');
            var results = quesCollection.find({public: true});
            results.toArray(function(err, ques){
               res.send(ques);
            });
         }
      });
   });

   return router;
}
