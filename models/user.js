const db = require('../db/db');

const UserModel = db.model('User');

class User extends UserModel {
	constructor({ telegram_id, username, first_name, last_name, tracked_assets=[] }) {
		super();
		this.telegram_id = telegram_id;
		this.tracked_assets = tracked_assets;
		this.first_name = first_name;
		this.last_name = last_name;
		this.username = username;
	}

	track({ asset, min, max }) {
		let already_has_index = this.tracked_assets.findIndex(({ asset:uasset }) => uasset.toUpperCase() === asset.toUpperCase());
		let already_has = already_has_index > -1 ? this.tracked_assets[already_has_index] : null;
		if(already_has) {
			if(already_has.min === min && already_has.max === max) {
				return Promise.resolve();
			}

			this.tracked_assets.splice(already_has_index, 1);
		}

		this.tracked_assets.push({ asset, min, max });
		return this.save();
	}

	static tracking({ asset }) {
		let params = {
			'tracked_assets.asset': asset
		};

		return this.get(params);
	}
}

module.exports = User;
