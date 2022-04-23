var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var signUpRouter = require('./routes/signUp');
var loginRouter = require('./routes/login');
var loginGoogleRouter = require('./routes/loginGoogle');
var checkLoginRouter = require('./routes/isUserLoggedIn');
var firebaseRouter = require('./routes/firebase');
var currentUserRouter = require('./routes/current-user');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//OLD ROUTING DECLARATION, WILL DEPRECATE. TO MAKE NEW API, SEE BELOW EXAMPLE
app.use('/', indexRouter);
app.use('/signUp', signUpRouter);
app.use('/login', loginRouter);
app.use('/loginGoogle', loginGoogleRouter);
app.use("/firebase", firebaseRouter);
app.use("/isUserLoggedIn", checkLoginRouter);
app.use("/current-user", currentUserRouter);

// NEW ROUTING EXAMPLE
require('./routes/users-route')(app);
require('./routes/events-route')(app);
require('./routes/farmers-route')(app);
require('./routes/reviews-route')(app);
require('./routes/payment-route')(app);

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

  if (err) {
    console.log('Error', err);
  } else {
    console.log('404')
  }
});

module.exports = app;
