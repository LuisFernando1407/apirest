const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
	},
	occupation: {
		type: String,
		required: true,
		default: null,
	},
	sex: {
		type: String,
		required: true,
		default: null,
	},
	phone: {
		type: String,
		required: false,
		default: null,
	},
	avatar: {
		type:String,
		required: false,
		default: null,
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

UserSchema.pre('save', async function(next){
	
	const hash = await bcrypt.hash(this.password, 10);
	
	this.password = hash;

	next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;