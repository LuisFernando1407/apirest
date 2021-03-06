const express = require('express');

const User = require('../models/User');

const Task = require('../models/Task');

const FCMToken = require('../models/FCMToken');

const bcrypt = require('bcryptjs');

const authMiddleware = require('../middlewares/auth');

const path = require('path');

const fs = require('fs');

const multer = require('multer');

const diskStorage = multer.diskStorage({
	destination: function (req, file, cb){
		cb(null, 'src/uploads/');
	},
	filename: function (req, file, cb){
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
});

var upload = multer({ storage: diskStorage, limits: {fileSize: 1 * 1024 * 1024 }});

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {

	const id = req.userId;

	await User.findOne({_id: id}, function(err, user) {
		if(err){
			return res.status(400).json({"error": 'User not found'});
		}

		return res.json({user});
	});
});

router.put('/', upload.single('avatar'), async (req, res) => {

	const {name, sex, occupation, phone} = req.body;

	const file = req.file;

	const user = await User.find({_id: req.userId});

	var avatar = user[0].avatar;

	if(file){
		avatar = file.filename;
	}

	if(file && user[0].avatar != null){
		fs.unlink('./src/uploads/' + user[0].avatar, (err) => {
			if (err) {
				return res.status(400).json({"error": "Error deleting old image"})
			}
		});
	}

	try{
		await User.findOneAndUpdate({_id: req.userId}, {name, sex, occupation, phone, avatar}, {new: true}, (err, user) => {
			if(!user){
				return res.status(400).json({"error" : "User not found"});
			}
			return res.json({user})
		});
		
	}catch(err){
		return res.status(400).json({"error" : err});
	}

});

router.delete('/', async (req, res) => {
	try{
		const user = await User.find({_id: req.userId});

		if(!user){
			return res.status(400).json({"error" : "User not found"});
		}

		await User.find({_id: req.userId}).remove().exec();
		await FCMToken.find({user_id: req.userId}).remove().exec();
		await Task.find({user_id: req.userId}).remove().exec();

		return res.json({"success": "User successfully deleted"});
		
	}catch(err){

		return res.status(400).json({"error" : "Error deleting user"});

	}
});

router.post('/refresh_password', async (req, res) => {

	const {old_password, new_password} = req.body;

	const user = await User.findOne({_id: req.userId}).select('+password');

	if(!await bcrypt.compare(old_password, user.password)){
		return res.status(400).json({"error": "Invalid current password"});
	}

	const newPassword = await bcrypt.hash(new_password, 10);

	try{
		await User.findOneAndUpdate({_id: req.userId}, {password: newPassword}, {new: true}, (err, user) => {
			if(!user){
				return res.status(400).json({"error" : "User not found"});
			}
			return res.json({"success" : "password updated successfully"})
		});
		
	}catch(err){
		return res.status(400).json({"error" : err});
	}
});

module.exports = app => app.use('/user', router);