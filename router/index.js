var fs = require('fs');
var mongoose = require('mongoose');
var url = require('url');

mongoose.connect('mongodb://localhost/membership');

var db = mongoose.connection;

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

var Member = mongoose.model('Member', memberSchema);
var Data = mongoose.model('Data', dataSchema);

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


exports.member_db = function(req, res) {
	var uri = url.parse(req.url,true).query;
	if(uri.cmd == "del"){
		Member.remove({_id: uri.id}, function(err,result) {
			res.status(300);
		        res.redirect('/MEMBERDB');
		});
	}
	else{
		res.status(200);
		Member.count({}, function(err, count){
			Member.find({}, function(err,result){
				res.render('memberdb', {
					title: 'Member DB',
					page: 1,
					url: req.url,
					database: 'local',
					collectionName: 'members',
					documentCount: count,
					myMember: result,
					login: req.session.login,
					username: req.session.username
				});
			});
		});
	}
};


exports.dataview = function(req, res) {
	Data.count({}, function(err, count) {
		Data.find({}, function(err,result) {
			for(var i = 0; i < count; i++) {
				unblockTag(result[i].content);
			};
			res.status(200);
			res.render('dataview', {
				title: 'Data View',
				page: 2,
				documentCount: count,
				myData: result,
				url: req.url,
				login: req.session.login,
				username: req.session.username
			});
		});
	});
};

exports.login_post = function(req, res) {
	res.status(200);
	// Pull Member info out of MongoDB here...
	Member.findOne({ username: req.username, password: req.password }, function (err, member) {
		if(member != null) {
			req.session.login = 'login';
			req.session.username = req.username;
		};
		res.status(200);
		// after logging in, stay in the current page
		res.redirect(url.parse(req.url,true).query.url);
	});
};

exports.logout = function(req, res) {
	req.session.login = 'logout';
	
	res.status(200);
	// after logging out, stay in the current page
	res.redirect(url.parse(req.url,true).query.url);
};

exports.sign_up = function(req, res) {
	res.status(200);
	res.render('sign_up', {
			title: 'Sign up',
			url: req.url,
			page:5,
			login: req.session.login,
			username: req.session.username,
			existingUsername: 'null'
	});
};

exports.checkusername = function(req, res) {
	var uri = url.parse(req.url,true);
	Member.findOne({ username: uri.query.id }, function (err, member) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		if(member != null) {
			res.end('true');
		}
		else {
			res.end('false');
		}
	});
}




// Sign up Post
exports.sign_up_post = function(req, res) {
	res.status(200);

	var curUsername = req.username;
	if(curUsername == "") {
		res.redirect('/');
	}
	else {
		Member.findOne({ username: curUsername }, function (err, member) {
	  		if (err) return handleError(err);
	  		
	  		if(member == null) { // new username
	  			// add myMember into the model
				var myMember = new Member({ username: curUsername, password: req.password, email: req.email });
				myMember.save(function (err, data) {
					if (err) {// TODO handle the error
						console.log("error");
				    }
				    console.log('member is inserted');
				});
				res.redirect('/MEMBERDB');
	  		}
	  		else { // in case that Username already exists
	  			res.redirect('/');
	  		}
		});
	}
};

// // Insert user content(s) through Naver SmartEditor
// exports.insertData = function(req, res) {
// 	if(req.session.login=='login'){
// 		var myData = new Data({
// 			title: req.body.title,
// 			content: req.body.ir1});
// 		myData.save(function (err, data) {
// 			if (err) {// TODO handle the error
// 				console.log("error");
// 		    }
// 		console.log('message is inserted');
// 		});
// 	}

// 	res.status(200);
// 	// after inserting data, stay in the current page
// 	res.redirect(url.parse(req.url,true).query.url);
// };

