var express = require('express');
var app = express();
var routes = require('./routes/index')(app);
var user = require('./routes/user');
var http = require('http');
var engine = require('ejs-locals');
var fs = require('fs');
var util = require('util');
var url = require('url');
var crypto = require('crypto');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('express-method-override');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');

// ------- Hash Key Generation for Password -------
var myHash = function myHash(key) {
    var hash = crypto.createHash('sha1');
    hash.update(key);
    return hash.digest('hex');
};

// ------- Create Session -------
var createSession = function createSession() {
    return function (req, res, next) {
        if (!req.session.login) {
            req.session.login = 'logout';
        }
        next();
    };
};


var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000");    
});


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(bodyParser({
    limit: '800mb',
    uploadDir: __dirname + '/public/se/uploadTmp'
}));
app.use(methodOverride());
app.use(cookieParser());
app.use(expressSession({
    secret: 'keyboard cat',
    cookie: {
        maxAge: 600000
    }
}));


app.use(createSession());
 
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', engine);




// app.post('/LOGIN', function(req,res,next) {
//     req.username = req.body.username;
//     req.password = myHash(req.body.password);
//     next();
//   },routes.login_post);

// app.get('/LOGOUT', routes.logout);