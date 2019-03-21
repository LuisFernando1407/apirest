const schedule = require('node-schedule');

const admin = require('firebase-admin');

const FCMToken = require('../models/FCMToken');

const Task = require('../models/Task');

const ObjectId = require('mongodb').ObjectID;

const serviceAccount = require('../../config/my-tasks-f5a00-firebase-adminsdk-boke3-3c01fef3cb.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL_FIREBASE
});

/* every 8 second */
schedule.scheduleJob('*/8 * * * * *', () => {

    FCMToken.find({}, async (err, fcmtokens) => {
        if(fcmtokens.length > 0){
            fcmtokens.forEach(async (fcm) => {
                await Task.find({user_id: fcm.user_id}, async (err, tasks) => {  
                    if(tasks.length > 0){
                        tasks.forEach((task) => {
                            if(fcm.is_accepted){
                                if(new Date().toLocaleString('pt-Br') == new Date(task.date).toLocaleString('pt-Br')){
                                    if(!task.is_notified){
                                        var message = {
                                            data: {
                                                title: task.title,
                                                body: task.description == null ? "Tarefa programada para hoje" : task.description,
                                                id: ObjectId(task._id).toString()
                                            },
                                            token: fcm.token
                                        };
                                        
                                        admin.messaging().send(message).then(async (resp) => {
                                            await Task.findOneAndUpdate({_id: task._id}, {is_notified: true});
                                            console.log("Notify-s", resp);
                                        }).catch((err) => {
                                            console.log("Notify-e", err);
                                        });
                                    }
                                }
                            }
                        });
                    }
                });
            });
        }
    });;
});