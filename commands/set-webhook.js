if (process.argv && process.argv.indexOf('-v') > -1) {
	const pkg = require('../package.json');
	return console.log(`Telegram: version ${pkg.version}`);
}

const argumentate = require('argumentate');
const Telegram = require('../lib/telegram/client');

const { variables } = argumentate(process.argv.slice(2));
const [ url ] = variables;

if(!url) {
	return console.error('Telegram - Set Webhook: URL Required');
}

const set_webhook = ({ url }) => {
	Telegram.request({
		method: 'POST',
		path: 'setWebhook',
		data: {
			url,
		}
	}).then((response) => {
		console.log(`Telegram - Set Webhook: Webhook set for ${url}!`);
		console.log(response);
	}).catch(e => {
		console.error(e);
	});
}

set_webhook({ url });
