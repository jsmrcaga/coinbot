const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/router');

const app = express();

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

module.exports = {
	server: app,
	app
};
