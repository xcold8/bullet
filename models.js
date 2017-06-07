var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

mongoose.connect('mongodb://testing:1234@ds113282.mlab.com:13282/bulletdb');

var userSchema = new Schema({
	first_name: String,
	last_name: String,
	email: String,
	password: String,
	created_ts: Date,
	updated_ts: Date,
	last_login_ts: Date,
});
var User = mongoose.model('User', userSchema);

var schemaTasks = new Schema({
	title: String,
	body: String,
	creator: {type: Schema.ObjectId, ref:'User'},
	assignees: [{type: Schema.ObjectId, ref:'User'}],
	status: Number,
	tasktype: Number,
	created_ts: Date,
	updated_ts: { type: Date, default: Date.now },
});
var Task = mongoose.model('Tasks', schemaTasks);

var schemaTag = new Schema({
	name: String,
	creator: {type: Schema.Types.ObjectId, ref: 'User'},
	created_ts: Date,
	updated_ts: { type: Date, default: Date.now }
});
var Tag = mongoose.model('Tag', schemaTag);

module.exports = {
	User: User,
	Task: Task,
	Tag: Tag
};
