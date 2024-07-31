var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

//api
var admin_api = require('./api/admin_api');
var game_api = require('./api/game_api');
//router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin',express.static(path.join(__dirname, 'admin')));

app.use(session({
  key: 'chartbitfaker@!@#', // 세션키
  secret: '@#@$im24fakerkey12#@$#$',
  resave: true,
  saveUninitialized: true,
  cookie: {
    expires : new Date(Date.now() + 31536000000),
    maxAge: 1000 * 60 * 60 * 24 * 365 // 쿠키 유효기간 1년
  }
}));

app.use('/admin_api', admin_api);
app.use('/game_api', game_api);


app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
