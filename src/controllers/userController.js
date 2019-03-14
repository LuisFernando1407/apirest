const express = require('express');
const User = require('../models/User');

const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {

	const id = req.userId;

	await User.findOne({_id: id}, function(err, user) {
		if(err){
			return res.status(400).json({error: 'User not found'});
		}

		return res.json({user});
	});
});


router.put('/:id', async (req, res) => {

	const { id } = req.params; 

	await User.findOne({_id: id}, function(err, user) {
		if(err){
			return res.status(400).json({error: 'User not found'});
		}

		return res.json({user});
	});

});

module.exports = app => app.use('/user', router);