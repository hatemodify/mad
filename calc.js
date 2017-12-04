const express =  require('express')
, http = require('http');

const app = express();

app.use((req, res, next) => {
    console.log('1 req');

    req.user = 'mike';

    next();

});


app.use('/' ,(req, res, next) => {
    console.log('2 req');

    res.writeHead('200' , {'Content-Type': 'text/html;charset=utf-8'});
    res.end('<h1>Express 서버에서'+ req.user+ '응답한 결과 입니다.</h1>');

});


http.createServer(app).listen(3000, ()=>{
    console.log('3000');
});