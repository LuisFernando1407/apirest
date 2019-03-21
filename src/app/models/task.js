const mongoose = require('../../database');

const Schema = mongoose.Schema;

const TaskSchema = new mongoose.Schema({
	user_id: {
		type: Schema.Types.ObjectId, ref: "User"
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		default: null,
		required: false,
	},
	date: {
		type: String,
		required: true,
	},
	is_notified: {
		type: Boolean,
		default: false,
		required: false
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;