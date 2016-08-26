
module.exports = function(db) {
   var express = require('express');
   var session = require('express-session');
   var socket_io = require('socket.io');
   var path = require('path');
   var favicon = require('serve-favicon');
   var logger = require('morgan');
   var cookieParser = require('cookie-parser');
   var bodyParser = require('body-parser');
   var await = require('asyncawait/await');
   var MongoSession = require('connect-mongo')(session);
   var errors = require('./base/errorcons');
   // var mongo = require('mongodb');

   // mongodb.urlToDB = 'mongodb://127.0.0.1/socialdb';
   // var mongodb;
   // mongo.MongoClient.connect('mongodb://127.0.0.1/socialdb', function(err, db){
   //    if(err){
   //       return;
   //    }
   //    else{
   mongodb = db;
   //       console.log(mongodb);
   //    }
   // });

   var app = express();
   var io = socket_io();
   app.io = io;

   var index = require('./routes/index');
   var users = require('./routes/users')(mongodb, errors);
   var gameScreen = require("./routes/gameScreen")(io, mongodb, errors);
   var templates = require('./routes/templates');
   var gamecont = require('./routes/gamecontroller')(mongodb, errors);
   var services = require('./routes/services')(io, mongodb, errors);
   var questions = require('./routes/questions')(mongodb, errors);
   var profile = require('./routes/profile')(mongodb, errors);

   // view engine setup
   //TODO - change the view engine to pug
   app.set('views', path.join(__dirname, 'views'));
   app.set('view engine', 'jade');

   // uncomment after placing your favicon in /public
   //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
   app.use(logger('dev'));
   app.use(session({
      secret: "secret-service onIce",
      resave: true,
      name: 'Social-Trivia',
      cookie: {
         path: '/',
         httpOnly: false,
         secure: false,
         expires: null,
         maxAge: 14*24*60*60*1000
      },
      saveUninitialized: false,
      httpOnly: false,
      store: new MongoSession({
         url: "mongodb://admin:123456@127.0.0.1/socialdb?authMechanism=DEFAULT",
         ttl: 14*24*60*60*1000
      })
   }));
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({ extended: false }));
   app.use(express.static(path.join(__dirname, 'public')));

   app.use('/', index);
   app.use('/services', services);
   app.use('/templates', templates);
   app.use('/users', users);
   app.use(function(req, res, next){
      if(req.session.nickname){
         next();
      }else{
         res.redirect('/login?last='+req.originalUrl);
      }
   });
   app.use('/profile', profile);
   app.use('/questions', questions);
   app.use('/gamescreen', gameScreen);
   app.use('/gamecontroller', gamecont);

   // catch 404 and forward to error handler
   app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
   });

   // error handlers

   // development error handler
   // will print stacktrace
   if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
         res.status(err.status || 500);
         res.render('error', {
            message: err.message,
            error: err
         });
      });
   }

   // production error handler
   // no stacktraces leaked to user
   app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
         message: err.message,
         error: {}
      });
   });


   return app;
}
