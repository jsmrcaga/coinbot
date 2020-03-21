const Telegram = require('../telegram/client');
const Commands = require('./commands');

class Bot {
	constructor() {}

	message({ commands=[], message, user, channel }) {
		if(commands.length) {
			return commands.forEach(command => {
				let new_message = message.replace(command, '').trim();
				this.command({ command, message: new_message, user, channel })
			});
		}

		Telegram.send({
			channel: channel.id,
			text: 'Oopsie doopsie dooba di doo'
		}).catch(e => {
			console.error('[BOT] Error sending message', e);
		});
	}

	command({ command, message, user, channel }) {
		let _command = command.replace('/', '');
		if(!Commands[_command]) {
			Telegram.send({
				channel: channel.id,
				text: 'WTF?'
			}).catch(e => {
				console.error('[BOT] Error sending message', e);
			});
		}

		return Commands[_command]({ message, user, channel });
	}
}

let bot = new Bot();

module.exports = bot;
