const mongoose = require('mongoose');

mongoose.connect(
	`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@clusterapis-vcnsu.mongodb.net/api?retryWrites=true`,
	{useCreateIndex: true, useNewUrlParser: true}
);
mongoose.Promise = global.Promise;

module.exports = mongoose;