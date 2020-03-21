const express = require('express');
const router = express.Router();

const Bot = require('../lib/bot/bot');
const User = require('../models/user');

router.post('/message', (req, res, next) => {
	res.sendStatus(200);

	let { message } = req.body;

	let channel = message.chat;
	let commands = message.entities.map(({ type, offset, length }) => {
		if(type !== 'bot_command') {
			return null;
		}

		let command = message.text.slice(offset, offset + length);
		return command;
	}).filter(e => e);

	const user = User.get({
		telegram_id: message.from.id
	}).then(([user]) => {
		if(!user) {
			user = new User({
				username: message.from.username,
				first_name: message.from.first_name,
				last_name: message.from.last_name,
				telegram_id: message.from.id
			});
			return user.save();
		}

		return Promise.resolve(user);
	}).then(user => {
		return Bot.message({
			commands,
			user,
			message: message.text,
			channel
		});
	}).catch(e => {
		console.error(e);
	});
});

module.exports = router;
