const fishingrod = require('fishingrod');

class Telegram {
	constructor(token) {
		this.token = token;
		if(!token) {
			throw new Error('[Telegram] Cannot instanciate without token');
		}
	}

	request({ method, path, data }) {
		return fishingrod.fish({
			method,
			host: `api.telegram.org`,
			path: `/bot${this.token}/${path}`,
			data,
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(({ response, status }) => {
			if(status < 200 || status > 200) {
				console.error('[TELEGRAM]', response);
				throw new Error('[Telegram] Could not send message');
			}

			return JSON.parse(response);
		}).catch(e => {
			throw e;
		});
	}

	send({ channel, text='', parse_mode='Markdown' }) {
		const params = {
			method: 'POST',
			path: 'sendMessage',
			data: {
				chat_id: channel,
				text,
				parse_mode,
			}
		};

		return this.request(params);
	}
}

module.exports = Telegram;
