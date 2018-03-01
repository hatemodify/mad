const express = require('express');
const router = express.Router();


router.get('/', (req, res)=>{
    res.render('index');
});

router.get('/about', (req, res)=>{
    res.render('about');
});

router.get('/portfolio', (req, res)=>{
    res.render('portfolio');
});

router.get('/contact', (req, res)=>{
    res.render('contact');
});

module.exports = router;
// module.exports = function (app) {
//     app.get('/', function (req, res) {
//         res.render('index', {
//             title: 'MAD'
//         });
//     });
//     app.get('/about', function (req, res) {
//         res.render('about', {
//             title: 'About'
//         });
//     });
//     app.get('/project', function (req, res) {
//         res.render('project', {
//             title: 'Project'
//         });
//     });
//     app.get('/user', function (req, res) {
//         res.render('user.ejs', {
//             title: 'user'
//         });
//     });
// }