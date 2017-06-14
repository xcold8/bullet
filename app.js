var path = require('path');
var express = require('express');
var session = require('express-session');
var app = express();
var flash = require('connect-flash');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var connect = require('connect');
var http = require('http');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var models = require('./models');
var Task = models.Task;
var User = models.User;
var user_id = '59410cfda172050d645cce72';
var bCrypt = require('bcrypt');
var saltRounds = 10;
var myPlaintextPassword = 's0/\/\P4$$w0rD';
var someOtherPlaintextPassword = 'not_bacon';
var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
};
require('handlebars');

passport.use('local', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    // check in mongo if a user with username exists or not
    User.findOne({ 'email' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        // User exists but wrong password, log the error 
        if (password !== user.password){
          console.log('Invalid Password');
          return done(null, false, 
              req.flash('message', 'Invalid Password'));
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.use(flash());
// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');

// create application/json parser
var jsonParser = bodyParser.json();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
// redirect to tasks view
app.get('/', function(req, res){
		res.redirect('/login');	
});
//add a public folder to static route
app.use(express.static(path.join(__dirname, 'public')));
app.get('/tasks', function(req, res){
	res.sendFile(__dirname + '/public/bullet.html');
		Task.find({'creator.$oid':+user_id})
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
	Task.
		findOne({'creator':user_id}).
		populate('creator').
		populate('assignees').
		exec(function(err, story){
			if (!err){
				console.log(story);
				res.json(story);
			}
			else {
				console.log('err occured while tried to populate');
			}
		});

	});
app.post('/login_auth', passport.authenticate('local', {
    successRedirect: '/tasks',
    failureRedirect: '/login',
    failureFlash : true
  }));

app.get('/login', function(req,res){
	res.sendFile(__dirname + '/public/login.html');

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
