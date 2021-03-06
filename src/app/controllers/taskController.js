const express = require('express');

const Task = require('../models/Task');

const admin = require('firebase-admin');

const FCMToken = require('../models/FCMToken');

const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
	try{
		const tasks = await Task.find({user_id: req.userId});
		
		return res.json({"tasks": tasks});

	}catch(err){

		return res.status(400).json({"error" : "Error loading tasks"});

	}
});

router.get('/:id', async (req, res) => {
	try{
		const task = await Task.findById(req.params.id);
		
		if(!task){
			return res.status(400).json({"error" : "Task not found"});
		}
		
		return res.json({task});

	}catch(err){

		return res.status(400).json({"error" : "Error loading task"});

	}
});

router.post('/', async (req, res) => {
	try{
		const task = await Task.create({...req.body, user_id: req.userId});

		return res.json(task);
		
	}catch(err){
	
		return res.status(400).json({"error" : err});

	}
});

router.put('/:id', async (req, res) => {
	try{
		await Task.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, (err, task) => {
			if(!task){
				return res.status(400).json({"error" : "Task not found"});
			}
			return res.json({task})
		});
		
	}catch(err){
		return res.status(400).json({"error" : err});
	}
});

router.delete('/:id', async (req, res) => {
	try{
		const task = await Task.find({_id: req.params.id});

		if(!task){
			return res.status(400).json({"error" : "Task not found"});
		}

		await Task.find({_id: req.params.id}).remove().exec();

		return res.json({"success": "Task successfully deleted"});
		
	}catch(err){

		return res.status(400).json({"error" : "Error deleting task"});

	}
});

router.post('/notification', async (req, res) => {
	const {fcm_token, is_accepted} = req.body;

	/* Token is empty */
	if(!fcm_token){
		return res.status(400).json({"error" : "FCM token not provider"});
	}

	/* Token invalid */
	const message = {
        data: {
            title: 'Notification accept',
        },
        token: fcm_token
	};
	
	/* Mod simulate */
	admin.messaging().send(message, true).then( async (resp) => {
		
		const fcmNotify = await FCMToken.find({user_id: req.userId});

		/* User not fcm token for messagin */
		if(fcmNotify.length == 0){
			await FCMToken.create({token: fcm_token, user_id: req.userId})
			return res.json({"success": "FCM Notify create success"});
		}else{
			await FCMToken.update({user_id: req.userId}, { $set: 
				{token: fcm_token, is_accepted: is_accepted}
			});

			return res.json({"success": "FCM Notify update success"});
		}
    }).catch((err) => {
        return res.status(400).json({"error" : err.message});
    });

});

router.get('/notification/status', async (req, res) => {

	const fcm = await FCMToken.find({user_id: req.userId});

	if(!fcm){
		return res.status(400).json({"error": "FCM Token not provider"})
	}
	return res.json({fcm});

});

module.exports = app => app.use('/user/tasks', router);