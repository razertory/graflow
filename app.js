var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var log4js = require('log4js');
var logcfg = require('./log4cfg.json');

//router
var indexRouter = require('./routes/index');
var compareRouter = require('./routes/compare');

const APP_ENV = 'dev'; // 'dev' 'prod'
var app = express();

log4js.configure(logcfg[APP_ENV]);
var logger = log4js.getLogger();
console = logger;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/compare', compareRouter);

module.exports = app;