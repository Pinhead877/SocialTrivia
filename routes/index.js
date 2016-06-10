var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
   res.render('mainScreen/index');
});

router.get('/login', function(req, res){
   res.render('mainScreen/login', {base: req.headers.host});
});

router.get('/register', function(req, res){
   res.render('mainScreen/register')
});

module.exports = router;
