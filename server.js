var express = require('express');
var app = express();
var router = require('./router/main')(app);
var user = require('./router/user');
var morgan = require("morgan");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var http = require('http');
var engine = require('ejs-locals');
var fs = require('fs');
var util = require('util');
var url = require('url');
var crypto = require('crypto');
var path = require('path');







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

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")  
});

app.use(express.static('public'));



app.use(morgan('dev'));
app.use(bodyParser({limit:'800mb', uploadDir:__dirname + '/public/se/uploadTmp'}));
// app.use(express.methodOverride());
app.use(require('express-method-override')('method_override_param_name'));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 600000 }}));
app.use(createSession());
app.get('/');  
// app.post(...);

app.get('/',router.index);   

// app.post('/LOGIN', function(req,res,next){
//   req.username = req.body.username;
//   req.password = myHash(req.body.password);
//   next();
// },router.login_post);

// app.get('/logout', function (req, res) {
//   res.render('logout.ejs', { title: 'logout' });
// });  


// app.get('/SIGN_UP', router.sign_up);
// app.post('/SIGN_UP', function(req,res,next) {
//   if(req.body.password == req.body.confirm_password) {
//     req.username = req.body.username;
//     req.password = myHash(req.body.password);
//     req.email = req.body.email;
//     next();
//   }
//   else
//   {
//     res.redirect('/');
//   };
// },router.sign_up_post);


// app.get('/CHECKUSERNAME',routes.checkusername);


// app.post('/UPLOAD',function(req,res) {
//   var str = req.header('User-Agent');
//   var os = str.search("Win"); // if Windows: n is a numberic data greater than 0, if not the case(Mac/Linux) n is equal to -1
//   var fileName = req.files.file.path;
//   if(os == -1) { // for either Mac or Linux
//     fileName = fileName.split('/')[fileName.split('/').length-1];
//   }
//   else { // for Windows
//     fileName = fileName.split('\\')[fileName.split('\\').length-1];
//   }
//   res.writeHeader(200,{'Content-Type':'text/plain'});
//   res.write('&bNewLine=true');
//   res.write('&sFileName=' + fileName);
//   res.write('&sFileURL=/se/uploadTmp/' + fileName);
//   res.end();
// });

// app.post('/SUBMIT', routes.insertData);