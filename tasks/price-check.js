#!/usr/bin/env node
const Telegram = require('../lib/telegram/client');
const Coinbase = require('../lib/coinbase/coinbase');

const DB = require('../db/db');
const User = require('../models/user');

const users = [];

const currencies = [
	'XLM',
	'BTC',
	'ZRX',
	'ETH',
	'LTC',
	'XRP'
];

const check_currency = (asset) => {
	let _price = null;
	return Coinbase.price({
		currency: 'EUR',
		coin: asset,
		type: 'spot'
	}).then(price => {
		console.log(`${price.base}: ${price.amount}`);
		_price = price;
		return User.tracking({ asset });
	}).then(users => {
		console.log(users.length, 'users tracking', asset);
		if(!users || !users.length) {
			return;
		}

		let promises = users.map(user => {
			let tracked = user.tracked_assets.find(({ asset:uasset }) => uasset.toUpperCase() === asset.toUpperCase());
			if(!tracked) {
				return Promise.resolve();
			}

			if(_price.amount < tracked.min) {
				return Telegram.send({
					channel: user.telegram_id,
					text: `⚠️ ${asset.toUpperCase()} is *below* your tracking alert (_${tracked.min}_): *${_price.amount}* ${_price.currency}`
				});
			}

			if(_price.amount > tracked.max) {
				return Telegram.send({
					channel: user.telegram_id,
					text: `⚠️ ${asset.toUpperCase()} is *above* your tracking alert (_${tracked.max}_): *${_price.amount}* ${_price.currency}`
				});
			}
		});

		return Promise.all(promises);
		// Check for what users this is necessary
	}).catch(e => {
		console.error(e);
	});
};

const recursive_currency = (i=0) => {
	if(!currencies[i]) {
		return;
	}

	return check_currency(currencies[i]).finally(() => {
		recursive_currency(i+1);
	});
};

DB.connect().then(() => {
	recursive_currency();
	setInterval(recursive_currency, 1000 * 60 * 5); // 5 minutes
}).catch(e => {
	console.error('Could not connect to db', e);
});
