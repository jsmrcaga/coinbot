const Telegram = require('./telegram');

telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);

module.exports = telegram;
