const DB = require('./db/db');
const { server } = require('./server');

DB.connect().then(() => {
	server.listen(process.env.PORT || 9873, (err) => {
		if(err) {
			console.error('Could not start server', err);
			process.exit(1);
		}

		console.log('Server listening on port', process.env.PORT || 9873);
	});
}).catch(e => {
	console.error('Could not connect to db:', err);
	process.exit(1);
});

process.on('uncaughtException', e => {
	console.error(e);
	process.exit(1);
});

process.on('unhandledRejection', e => {
	console.error(e);
	process.exit(1);
});
