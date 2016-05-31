var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res){
   console.log("login");
   req.session.username = req.body.username;
   res.send({id: req.session.id});
});

router.get('/logout', function(req, res){
   req.session.destroy(function(err){
      console.log(err);
   });
   res.sendStatus(200);
});

module.exports = router;
