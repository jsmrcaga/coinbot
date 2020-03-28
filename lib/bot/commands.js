const Coinbase = require('../coinbase/coinbase');
const Telegram = require('../telegram/client');

const argumentate = require('argumentate');

const Commands = {};

const is_currency = (text, channel) => {
	if(text.length !== 3) {
		Telegram.send({
			channel: channel.id,
			text: `Wow wow! ${text} is not a valid currency on Coinbase`
		}).catch(e => {});
		return Promise.reject(new Error('BAD FORMAT'));
	}

	return Coinbase.price({
		currency: 'EUR',
		coin: text.toUpperCase(),
		type: 'spot'
	}).catch(e => {
		return Telegram.send({
			channel: channel.id,
			text: `Wow wow! ${text} is not a valid currency on Coinbase`
		});
	}).catch(e => {
		console.error('Could not send message', e);
	});
}

Commands['start'] = ({ message, user, channel }) => {
	return Telegram.send({
		channel: channel.id,
		text: `Welcome! Please use the provided commands, I don't understand natural language`
	});
};

// /track XLM 0.03 0.5
Commands['track'] = ({ message, user, channel }) => {
	let { variables } = argumentate(message.split(' '));
	console.log('Variables', variables, message);
	let [ currency, min, max ] = variables;
	min = parseFloat(min);
	max = parseFloat(max);

	is_currency(currency, channel).then(price => {
		return user.track({
			asset: currency,
			min,
			max
		}).then(() => {
			return Telegram.send({
				channel: channel.id,
				text: `Current price for ${currency} is: *${price.amount}* ${price.currency}.\nTracking:\n- Below: ${min}\n- Above: ${max}`
			});
		}).catch(e => {
			return Telegram.send({
				channel: channel.id,
				text: `Oopsie doopsie, please try again later`
			});
		});
	}).catch((e) => {
		console.error('[Commands][Track]', e);
	});
};

Commands['price'] = ({ message, user, channel }) => {
	is_currency(message, channel).then(price => {
		return Telegram.send({
			channel: channel.id,
			text: `Current price for ${message} is: ${price.amount} ${price.currency}`
		});
	}).catch((e) => {
		console.error('[Commands][Price]', e);
	});
};

Commands['list'] = ({ message, user, channel }) => {
	let tracked =[];
	for(let { asset, min, max } of user.tracked_assets) {
		tracked.push(`Tracking *${asset}*:\n* Below: ${min}\n* Above: ${max}`);
	}

	return Telegram.send({
		channel: channel.id,
		text: tracked.join('\n')
	}).catch((e) => {
		console.error('[Commands][Track]', e);
	});
};

module.exports = Commands;
