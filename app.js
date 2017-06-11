var path = require('path');
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var connect = require('connect');
var http = require('http');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var models = require('./models');
var Task = models.Task;
var User = models.User;
var user_id = '5937f4ebb981c418c1ecdee0';
//app.set('view engine', 'ejs');


// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');

// create application/json parser
var jsonParser = bodyParser.json();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
// redirect to tasks view
app.get('/', function(req, res){
		res.redirect('/tasks');	
});
//add a public folder to static route
app.use(express.static(path.join(__dirname, 'public')));
app.get('/tasks', function(req, res){
	res.sendFile(__dirname + '/public/bullet.html');
		Task.find({'creator._id':'5937f4ebb981c418c1ecdee0'})
		.exec(function(err, results){
			if (!err){
				console.log(results);
				return results;
			}
			else {
				console.log('err occured: '+err);
			}
		});
});

app.get('/api/getData', function (req, res){
	Task.find({'creator._id':'5937f4ebb981c418c1ecdee0'}).
	exec(function(err, results){
		if (!err){
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('200', 'Success');
			res.sendStatus('200');
			res.send(JSON.stringify(results));
		}
		else {
			console.log('error occured '+err);
		}

	});
	
});
app.post('/login', jsonParser, function(req,res){
	User.find({email: req.body.email}, function (err, results){
		if (results.length){ // if (results.length > 0)
			console.log('Getting tasks for user');
			for (var i=0; i < results.length; i++) {
				if (results[i].tasks){
					var userTasks = results[i].tasks;
					return userTasks;
				}
				
		  	}
	  	} 
	  	else {
			User.create(req.body, function (err, data){
				if (err){
					console.log('error occured');
				} else {
					console.log('first registration at the db success');
				}
			});
		}
	});
	res.sendStatus(200);

});

app.get('/api/todos', function(req, res) {
	var cook = req.headers.cookie;
	User.find({email: cook.substring(6)}, 'tasks')
	.exec(function(err, results) {
		if(err){
			res.send('error occured');
		}
		else {
			res.send(results);

			return results;

		}

	});
});

app.listen(3000, function (){
	console.log('Listening on port 3000');
});
app.post('/api/todos/new', jsonParser, function(req, res){
	var conditions = {"email": req.body.email};
	var update = {"tasks": []};
	var options = {multi: true};
	User.update(conditions, update, options, function (err){
		if (err) return handleError(err);
		else { 
			console.log('deleted successfully');
		}	
	});
	var userEmail = req.body.email;
	var jdata = req.body.updated_tasks;
	var items = [];
 	for (var i=0; i < jdata.length; i++){
 		items.push(jdata[i]);
 		console.log(items);
 	}
 	User.update(conditions, {"tasks": items}, options, function (err){
 		if (err) {
 			console.log('failed to write into DB');
 		} else { 
 			console.log('success writing db');
 		  }
 	});
 });
