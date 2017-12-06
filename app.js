var express = require('express')
, routes = require('./router')
, user = require('./router/user')
, http = require('http')
, engine = require('ejs-locals')
, fs = require('fs')
, util = require('util')
, url = require('url')
, crypto = require('crypto')
, path = require('path');


var morgan = require("morgan");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');




var myHash = function myHash(key){
  var hash = crypto.createHash('sha1');
  hash.update(key);
  return hash.digest('hex');
}

var createSession = function createSession(){
  return function(req, res, next){
    if(!req.session.login){
      req.session.login = 'logout';
    }
    next();
  };
};

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser({limit:'800mb', uploadDir:__dirname + '/public/se/uploadTmp'}));
app.use(require('express-method-override')('method_override_param_name'));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 600000 }}));
app.use(createSession());
app.get('/');  
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs',engine);

// app.post(...);

app.get('/',routes.index);   