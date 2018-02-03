module.exports = function(app){
    app.get('/',function(req,res){
        res.render('index.ejs' , {title:'MAD'});
     });
     app.get('/memberdb',function(req,res){
        res.render('memberdb.ejs', {title :'memberdb'});
    });
    app.get('/dataview',function(req,res){
        res.render('dataview.ejs', {title :'dataview'});
    });
    

}



var fs = require('fs');
var mongoose = require('mongoose');
var url = require('url');

mongoose.connect('mongodb://localhost/membership');
var db = mongoose.connection;



// ------- creates DB schema for MongoDB -------
// for membership
var memberSchema = mongoose.Schema({
    username: 'string',
    password: 'string',
    email: 'string'
});
// for contents
var dataSchema = mongoose.Schema({
    title: 'string',
    content: 'string',
});

// ------- compiles our schema into a model -------
var Member = mongoose.model('Member', memberSchema);
var Data = mongoose.model('Data', dataSchema);


// ------- route functions -------
// Main (page: 0)
exports.index = function(req, res) {
	res.status(200);
	res.render('index', {
		title: 'GCHOI',
		page: 0,
		url: req.url,
		login: req.session.login,
		username: req.session.username
	});
};