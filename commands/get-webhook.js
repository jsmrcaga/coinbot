if (process.argv && process.argv.indexOf('-v') > -1) {
	const pkg = require('../package.json');
	return console.log(`Telegram: version ${pkg.version}`);
}

const Telegram = require('../lib/telegram/client');

const get_webhook = () => {
	Telegram.request({
		method: 'GET',
		path: 'getWebhookInfo',
	}).then((response) => {
		console.log(`Telegram - Get Webhook:`);
		console.log(response);
	}).catch(e => {
		console.error(e);
	});
}

get_webhook();
