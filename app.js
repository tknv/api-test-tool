
var path = require('path');
global.appRoot = path.resolve(__dirname);

var express = require('express');
var morgan = require('morgan')
var parseurl = require('parseurl');
//var session = require('express-session');
var favicon = require('serve-favicon');


global.console = require('winston');
console.level = 'debug';

var bodyParser = require('body-parser');

var events = require('events');
global.eventEmitter = new events.EventEmitter();

var app = express();
app.use(morgan('combined'))

global.session = require("express-session")({
  secret: 'Aerohive Identity Ref APP Secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000 // 30 minutes
  }
});

// Use express-session middleware for express
app.use(session);;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(appRoot + '/bower_components'));

var routes = require('./routes/login');
var webapp = require('./routes/web-app');
var api = require('./routes/api');
var oauth = require('./routes/oauth');
var webhook = require('./routes/webhook');
app.use('/', routes);
app.use('/web-app/', webapp);
app.use('/api/', api);
app.use('/oauth/', oauth);
app.use('/webhook/', webhook);


app.get('/fail', function (req, res, next) {
  setTimeout(function () {
    var nu = null;
    nu.access();

    res.send('Hello World');
  }, 1000);
});
app.get('*', function (req, res) {
  res.redirect('/');
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
