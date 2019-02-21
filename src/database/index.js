const mongoose = require('mongoose');

mongoose.connect(
	`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DATABASE}?retryWrites=true`,
	{useCreateIndex: true, useNewUrlParser: true}
);
mongoose.Promise = global.Promise;

module.exports = mongoose;