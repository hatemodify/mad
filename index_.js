const http = require('http');
const path = require('path');
const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();
// const exphbs = require('express-handlebars');


// const MongoClient = require('mongodb').MongoClient;

mongoose.connect("mongodb://admin:asdasd12@ds145299.mlab.com:45299/maaadb"); // 1
const db = mongoose.connection; // 2
// 3﻿
db.once("open", function () {
    console.log("DB connected");
});
// 4
db.on("error", function (err) {
    console.log("DB ERROR : ", err);
});

// Other settings


// app.engine('.hbs', exphbs({
//     extname: '.hbs',
//     layoutsDir: path.join(__dirname, 'views', 'layout'),
//     partialsDir: path.join(__dirname, 'views', 'partials'),
//     defaultLayout: 'main',
//     helpers: {
//         foo: function () {
//             return "fosdfgsdfsdfsfsdfo";
//         }
//     }
// }));


app.set("view engine", "hbs");
// app.set("views", 'views');


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

const contactSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String },
    phone: { type: String }
})


const Contact = mongoose.model("contact", contactSchema);




app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
    res.render('index');
});

app.get("/contacts", function (req, res) {
    Contact.find({}, function (err, contacts) {
        if (err) return res.json(err);
        res.render("contacts/index", { contacts: contacts });
    })
});

// Contacts - New // 8
app.get("/contacts/new", function (req, res) {
    res.render("contacts/new");
});

// Contacts - create // 9
app.post("/contacts", function (req, res) {
    Contact.create(req.body, function (err, contact) {
        if (err) return res.json(err);
        res.redirect("/contacts");
    });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('server started' + app.get('port'));
    // connectionDb();
});


// app.listen(3000, function () {
//     console.log("server on!");
//     // connectionDb();
// });


