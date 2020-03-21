const { Database } = require('@jsmrcaga/mongo');

const database = new Database('main', {
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	endpoint: process.env.DB_ENDPOINT,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,
	useUnifiedTopology: true
});

module.exports = database;
