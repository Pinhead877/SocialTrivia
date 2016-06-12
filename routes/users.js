module.exports = function(mongodb) {
   var express = require('express');
   var router = express.Router();
   var mondb = mongodb.MongoClient;

   router.get('/profile', function(req, res, next) {
      res.render('profile/profilescreen');
   });

   router.post('/create', function(req, res){
      //TODO - add validation check if empty and check length
      mondb.connect(mongodb.urlToDB, function(err, db){
         var data = db.collection("users");
         var user = data.find({
            nickname: req.body.nickname
         });
         user.toArray(function(e,user){
            if(user.length>0){
               res.send({error: "nickname already exists!"});
            }else{
               var ins = data.insert(req.body);
               console.log(ins);
               res.sendStatus(200);
            }
         });
      });
   });

   router.post('/login', function(req, res){
      mondb.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send({error: "DB Connection error"})
         }else{
            var data = db.collection("users");
            var user = data.find({
               nickname: req.body.nickname,
               password: req.body.password
            });
            user.toArray(function(e,user) {
               console.log(user);
               if(user.length === 0){
                  res.sendStatus(500);
               }else if(user.length===1){
                  var sess = req.session;
                  sess.nickname = user[0].nickname;
                  sess.userid = user[0]._id;
                  res.sendStatus(200);
               }
            })
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
