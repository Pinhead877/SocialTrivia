var express = require('express');
var router = express.Router();

//        /users

/* GET users listing. */

router.get('/profile', function(req, res, next) {
  res.render('profile/profilescreen');

router.get('/', function(req, res, next) {
   res.send('respond with a resource');
});

router.post('/login', function(req, res){
   console.log("login");
   console.log(req.body.username);
   var sess = req.session;
   sess.username = req.body.username;
   sess.userid = 9999;
   console.log(sess);
   sess.save();
   res.sendStatus(200);
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

module.exports = router;
