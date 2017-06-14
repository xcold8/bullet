var enums = require('./enums');

var models = require('./models');
var alex = new models.User({
	first_name:'alex', 
	last_name:'blaa', 
	email:'alexey@walla.com', 
	password:'blattttttttt', 
	created_ts:+ new Date(), 
	updated_ts:+new Date(), 
	last_login_ts: +new Date()
});
var aTask = new models.Task({
	title:'understand something',
	body: "This is only a test to see if this task is visible",
	creator: alex._id,
	assignees: alex._id,
	status: enums.task_statuses[0],
	tasktype:enums.task_types[1],
	created_ts:+ new Date(),
	updated_ts:+ new Date()
});
console.log('executing save to db...');
alex.save(function(err){
	console.log('save in progress');
	if (!err){
		console.log('user has been written successfully to db');
		aTask.save(function(err){
			if (!err){
				console.log('Task has been written successfully');
			}
			else {
				console.log('error occured '+err);
			}
		});
	}
	else {
		models.User.find({}, function(err, docs){
			if (!err){ 
   			 console.log(docs);      
   			}
   			else {
   				console.log('error occured'+err);
   			}
		});

	}
});


