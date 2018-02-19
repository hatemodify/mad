
// @ts-nocheck
const express = require('express'),
    http = require('http'),
    fs = require('fs'),
    path = require('path');

const bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    mongodb = require('mongodb'),
    static = require('serve-static'),
    jquery = require('jquery'),
    mongoose = require('mongoose');


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
let UserSchema;
let UserModel;


function connectionDb() {
    const databaseUrl = 'mongodb://localhost/local';


    console.log('try db connect');

    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl, {
        useMongoClient: true
    });
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error'));

    database.on('open', () => {
        console.log('database connected');
        UserSchema = mongoose.Schema({
            id: {
                type: String,
                require: true,
                unique: true
            },
            name: {
                type: String,
                index: 'hashed'
            },
            password: {
                type: String,
                required: true
            },
            age: {
                type: Number,
                "default": -1
            }, created_at: {
                type: Date,
                index: {
                    unique: false
                },
                "default": Date.now
            }, updated_at: {
                type: Date,
                index: {
                    unique: false
                },
                "default": Date.now
            }
        });


        UserSchema.static('findById', (id, callback) => {
            return this.find({ id: id }, callback);
        });

        UserSchema.static('findAll', (callback) => {
            return this.find({}, callback);
        });

        console.log('Userschema defined');
        UserModel = mongoose.model('users2', UserSchema);
        console.log('UserModel defined');
        console.log('userschema defined');
        UserModel = mongoose.model("users", UserSchema);
        console.log('usermodel defined');
    });

    database.on('disconnected', () => {
        console.log('disconnected');
        setInterval(connectionDb, 5000);
    });


}



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
    if (database) {
        addUser(database, paramId, paramPassword, paramName, function (err, results) {
            if (err) throw err;

            if (result && result.insertCount > 0) {
                console.dir(result);
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>success </h1>');
                res.end();
            } else {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>failed </h1>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h1>db connect fail </h1>');
        res.end();
    }
});

router.route('/process/listuser').post((req, res) => {
    console.log('call list user');

    if (database) {
        UserModel.findAll((err, results) => {
            if (err) {
                console.log('error' + err.stack);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>error</h2>');
                res.write(err.stack);
                res.end();

                return;
            }

            if (results) {
                console.dir(results);
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<div><ul>');
                for (let i = 0; i < results.length; i++) {
                    const curId = results[i]._doc.id;
                    const curName = results[i]._doc.name;
                    res.write('<li>' + i + curId + ':' + curName + '</li>');
                }
                res.write('</ul></div>');
                res.end();
            }else{
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>failed</h2>');
                res.end();
            }
        });
    }
});

app.use('/', router);


function addUser(db, id, password, name, callback) {
    console.log('adduser call', id, password, name);

    const users = new UserModel({
        id: id,
        password: password,
        name: name
    });



    users.save((err) => {
        if (err) callback(err, null); return;
        console.log('add user');
        callback(null, users);
    });

};

const authUser = function (db, id, password, callback) {
    console.log('authuser call');

    // const users = db.collection('users');

    UserModel.findById({ "id": id, "password": password }, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }

        console.log(id, password)
        console.dir(results);


        if (results.length > 0) {
            console.log('find' + id, password);
            if (results[0]._doc.password == password) {
                console.log('password correct');
                callback(null, results);
            } else {
                console.log('password not correct');
                callback(null, null);
            }
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