const mongoose = require('../database');
const bcrypt = require('bcryptjs');

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
		unique: true,
		required: false,
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});


const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;