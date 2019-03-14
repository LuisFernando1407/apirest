const express = require('express');
const Task = require('../models/Task');

const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {

	Task.find({}, function(err, tasks) {
		var taskMap = {};

		tasks.forEach(function(task){
			taskMap[task._id] = task;
		});

		var send = []

		if(taskMap.length > 0){
			send = [taskMap]
		}

		res.json({
			total: tasks.length, 
			data: send,
		});
	});
});

module.exports = app => app.use('/user/tasks', router);