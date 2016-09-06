
// BASE /
var express = require('express');
var router = express.Router();

/**
 * get the index page
 */
router.get('/', function(req, res, next) {
   res.render('mainScreen/index');
});

/**
 * shows the login page
 */
router.get('/login', function(req, res){
   res.render('mainScreen/login', {base: req.headers.host});
});

/**
 * shows the register page
 */
router.get('/register', function(req, res){
   res.render('mainScreen/register')
});
/**
 * shows the hall of fame page
 */
router.get('/halloffame', function(req, res){
   res.render('mainScreen/highscores');
});

module.exports = router;
