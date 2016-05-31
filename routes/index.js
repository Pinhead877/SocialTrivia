var express = require('express');
var router = express.Router();

// router.get('/', function(req, res, next){
//    console.log(req.cookies);
//    next();
// })
/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('mainScreen/index');
});

router.get('/create',function(req, res){
   res.render('mainScreen/create');
})

module.exports = router;
