const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();

function generateToken(params = {}) {
	return jwt.sign(params, process.env.SECRET, {
		expiresIn: 864000,
	});
}

router.post('/register', async (req, res) => {

	const {email} = req.body;

	try{

		if(await User.findOne({email})){
			return res.status(400).json({"error": "User already exists"});
		}	

		const user = await User.create(req.body);

		user.password = undefined;

		return res.json({
			user, 
			token: generateToken({id: user.id})
		});

	}catch(err){
		return res.status(400).json({"error": "Registration failed"});
	}
});


router.post('/login', async (req, res) => {

	const {email, password} = req.body;

	const user = await User.findOne({email}).select('+password');

	if(!user){
		return res.status(400).json({"error": "User not found"});
	}

	if(!await bcrypt.compare(password, user.password)){
		return res.status(400).json({"error": "Invalid password"});
	}

	user.password = undefined;

	return res.json({
		user, 
		token: generateToken({id: user.id})
	});

});

router.post('/forgot_password', async (req, res) => {

	const {email} = req.body;
	
	try{

		const user = await User.findOne({email});
		
		if(!user){
			return res.status(400).json({"error": "User not exists"});
		}
		
		return res.json({user});

	}catch(err){
		return res.status(400).json({"error": "Forgot password failed"});
	}

});

router.post('/refresh_password/:id', async (req, res) => {

	const {password} = req.body;

	const hash = await bcrypt.hash(password, 10);
	
	try{
		await User.findOneAndUpdate({_id: req.params.id}, {password: hash}, {new: true}, (err, user) => {
			if(!user){
				return res.status(400).json({"error" : "User not found"});
			}
			return res.json({"success" : "password updated successfully"})
		});
		
	}catch(err){
		return res.status(400).json({"error" : err});
	}
});

module.exports = app => app.use('/auth', router);