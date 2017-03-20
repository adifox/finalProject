/*jshint esversion:6*/
var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
const mongoose      = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const authController  = require("./routes/auth-controller");
const users           = require("./routes/users");
const session         = require("express-session");
const passport        = require("passport");
const LocalStrategy   = require("passport-local").Strategy;
const index           = require("./routes/index");
const flash           = require("connect-flash");
const User            = require("./models/user");
const bcrypt          = require("bcrypt");


require('./configs/database');
require('./configs/passport')(passport);
var cors = require('cors');


var app = express();

var whitelist = [
    'http://localhost:4200',
];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};

app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set("layout", "layouts/main-layout");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(flash());



// -- Configure the session -- //
app.use(session({
  secret: "passport-local-strategy",
  resave: true,
  saveUninitialized: true,
  cookie : { httpOnly: true, maxAge: 2419200000 }
}));



passport.use(new LocalStrategy({
    usernameField: 'email',
  passReqToCallback : true
},(req, email, password, next) => {
    console.log('Hola');
    console.log(email);
  User.findOne({ email }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }
    return next(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authController);
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.error(err.message);
  res.render('error');
});

module.exports = app;
