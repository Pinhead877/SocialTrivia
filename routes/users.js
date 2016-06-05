module.exports = function(mongodb) {
   var express = require('express');
   var router = express.Router();
   var mondb = mongodb.MongoClient;

   router.get('/profile', function(req, res, next) {
      res.render('profile/profilescreen');
   });

   router.post('/login', function(req, res){
      mondb.connect(mongodb.urlToDB, function(err, db){
         if(err){
            res.send({error: "DB Connection error"})
         }else{
            var data = db.collection("users");
            var user = data.find({
               username: req.body.username,
               password: req.body.password
            });
            user.toArray(function(e,user) {
               console.log(user);
               if(user.length === 0){
                  res.sendStatus(500);
               }else if(user.length===1){
                  var sess = req.session;
                  sess.username = user[0].username;
                  sess.userid = user[0]._id;
                  res.sendStatus(200);
               }
            })
         }
      });
      // console.log("login");
      // console.log(req.body.username);
      // var sess = req.session;
      // sess.username = req.body.username;
      // sess.userid = 9999;
      // console.log(sess);
      // sess.save();
      // res.sendStatus(200);
   });

   router.get('/logout', function(req, res){
      req.session.destroy(function(err){
         if(err){
            res.sendStatus(500);
            return;
         }
      });
      res.sendStatus(200);
      return;

   });

   return router;
}
