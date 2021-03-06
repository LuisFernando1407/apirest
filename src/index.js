const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(morgan('dev'));

require('dotenv').config();

require('./app/controllers/index')(app);
require('./app/job/notificationJob');

app.use('/files', express.static(path.resolve(__dirname, "uploads")));

app.listen(3000);