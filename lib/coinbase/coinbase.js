const fishingrod = require('fishingrod');

class Coinbase {
	request({ method='GET', path, data }) {
		return fishingrod.fish({
			method,
			path,
			data,
			host: 'api.coinbase.com',
			path: `/v2${path}`
		}).then(({ response, status }) => {
			if(status < 200 || status > 200) {
				console.error(response);
				throw new Error('Coinbase error');
			}

			return JSON.parse(response).data;
		}).catch(e => {
			console.error('[Coinbase] Could not call coinbase', e);
		});
	}

	price({ currency='EUR', coin, type='spot' }) {
		return this.request({
			path: `/prices/${coin.toUpperCase()}-${currency.toUpperCase()}/${type}`
		});
	}
}

let coinbase = new Coinbase();

module.exports = coinbase;
