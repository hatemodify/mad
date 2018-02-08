// @ts-nocheck
const express = require('express'),
    http = require('http'),
    fs = require('fs'),
    path = require('path');

const bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static');
// let errorHandler = require('errorhandler');

const expressErrorHandler = require('express-error-handler');

const expressSession = require('express-session');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


var route = require('./router/main')(app, fs);

const MongoClient = require('mongodb').MongoClient;

let database;

function connectionDb() {
    const databaseUrl = 'mongodb://localhost';

    MongoClient.connect(databaseUrl, (err, db) => {
        if (err) throw err;
        console.log('db connetcted' + databaseUrl);

        database = db.db('local');
    });
};



const router = express.Router();

router.route('/process/login').post((req, res) => {
    console.log('login call');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);

    if (database) {
        authUser(database, paramId, paramPassword, function (err, docs) {
            if (err) {
                throw err;
            }

            if (docs) {
                console.dir(docs);

                // 조회 결과에서 사용자 이름 확인
                var username = docs[0].name;

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
                res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
                res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
                res.end();

            } else {  // 조회된 레코드가 없는 경우 실패 응답 전송
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>로그인  실패</h1>');
                res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
                res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
                res.end();
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
    }
});

router.route('/process/adduser').post((req, res) => {
    console.log('adduserCall');

    const paramId = req.body.id || req.query.id;
    const paramPassword = req.body.password || req.query.password;
    const paramName = req.body.name || req.query.name;


    console.log(paramId, paramName, paramPassword);

    if(database){
        addUser(database, paramId, paramPassword, paramName,(err, result)=>{
            if(err) throw err;

            if(result && result.insertCount > 0 ){
                console.dir(result);
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>success </h1>');
                res.end();
            }else{
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>failed </h1>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h1>db connect fail </h1>');
        res.end();
    }
});



app.use('/', router);


function addUser(db, id, password, name, callback) {
    console.log('adduser call', id, password, name);

    const users = db.collection('users');

    users.insertMany([{
        "id": id,
        "password": password,
        "name": name
    }], (err, result) => {
        if (err) callback(err, null); return;
        result.insertCount > 0 ? console.log('add USer' + result.insertCount) : console.log('no record');

        callback(result, null);
    });

}



const authUser = function (db, id, password, callback) {
    console.log('authuser call');

    const users = db.collection('users');

    users.find({
        "id": id,
        "password": password
    }).toArray(function (err, docs) {
        if (err) {
            callback(err, null);
            return;
        }
        if (docs.length > 0) {
            console.log('find' + id, password);
            callback(null, docs);
        } else {
            console.log('not find');
            callback(null, null);
        }
    });
}


const errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);




http.createServer(app).listen(app.get('port'), function () {
    console.log('server started' + app.get('port'));

    connectionDb();
});