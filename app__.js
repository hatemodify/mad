const express = require('express'),
    http = require('http'),
    path = require('path');

const bodyParse = require('body-parser'),
    static = require('serve-static');


    
const app = express();
const router = express.Router();





app.set('port', process.env.PORT || 3000);

app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

router.route('/process/login').post((req,res)=>{
    console.log('login 처리');


    const paramId = req.body.id || req.query.id;
    const paramPassword = req.body.password || req.query.password;


    res.writeHead('200', {
        "Content-Type": "text/html;charset=utf8"
    });
    res.write('<h1>'+paramId+'</h1>');
    res.write('<h1>'+paramPassword+'</h1>');
    res.end();
});


app.use(static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log('first middleware');


    const paramId = req.body.id || req.query.id;
    const paramPassword = req.body.password || req.query.password;


    res.writeHead('200', {
        "Content-Type": "text/html;charset=utf8"
    });
    res.write('<h1>'+paramId+'</h1>');
    res.write('<h1>'+paramPassword+'</h1>');
    res.end();
});

app.use('/', router);

http.createServer(app).listen(3000, () => {
    console.log('express started on 3000port')
});