// 在初始化app.js最开头就连接数据库
require('./models/init');
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import connectMongodb from 'connect-mongo';
import session from 'express-session';

import config from './config';
import * as auth from './middlewares/auth';
import api from './route.api';
import page from './route.page';

const MongoStore = new connectMongodb(session);
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.cookieName));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: config.sessionSecret,
    store: new MongoStore({
      url: config.mongodbUrl
    }),
    resave: true,
    saveUninitialized: true
  })
);

app.use(auth.authUser);

app.use('/', page);
app.use('/api/v1', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message || err;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // the error response
  res.status(err.status || 500).format({
    json() {
      res.send({error: err.toString()});
    },

    html() {
      res.render('error');
    },

    default() {
      const message = `${errorDetails}`;
      res.send(`500 Internal server error:\n${err.toString()}`);
    },
  });
});

export default app;
