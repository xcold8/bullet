var enums = require('./enums');
var models = require('./models');
var alex = new models.User({first_name:'alex', last_name:'blaa', email:'alexey@walla.com', password:'blattttttttt', created_ts:+ new Date(), updated_ts:+new Date(), last_login_ts: +new Date()});
console.log('executing save to db...');
alex.save(function(err){
	console.log('save in progress');
	if (!err){
		console.log('written successfully');
	}
	else {
		
		models.User.find({}, function(err, docs){
			if (!err){ 
       		 console.log(docs);      
    } 
});
	}
});


