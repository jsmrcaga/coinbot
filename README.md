# Coinbot

A simple bot to track cryptocoin prices on Coinbase.

## Installation

You will need a mongoDB dataabase for this repository. If you want a free, easy-to-setup one, head over to mlab (recently bought by Mongo Atlas)

`npm i`

## Launch

Some environment variables are needed to launch the bot:

| Variable | Description |
|:--------:|:-----------:|
| `TELEGRAM_BOT_TOKEN` | The token given to you by @BotFather |
| `DB_USERNAME` | Username to connect to your MongoDB instance |
| `DB_PASSWORD` | Password to connect to your MongoDB instance |
| `DB_ENDPOINT` | Endpoint of your MongoDB database |
| `DB_PORT` | Port of your MongoDB database |
| `DB_DATABASE` | Database name |

The launch with: 
`npm start`

## Tasks

The only enabled task for now is `price-check.js`, which checks the prices of these cryptocurrencies:
* XLM
* BTC
* ZRX
* ETH
* LTC
* XRP
and warns user tracking them.

Launching tasks is up to you. But here's a quick guide to launch them using `crontab`

### Crontab

First of all, cron does not include all environment variables for you, so create a specific file where you will be storing them, for example `.env`:

```
# Export your variables
export DB_USERNAME=<variable value>
export DB_PASSWORD=<variable value>
export DB_ENDPOINT=<variable value>
export DB_DATABASE=<variable value>
export DB_PORT=<variable value>

export TELEGRAM_BOT_TOKEN=<variable value>

```

THen you can edit your file. Since cron does not include all binaries, we will call node js from its full path:

```
*/5 * * * * . /root/coinbot/.env; /usr/local/bin/node /root/coinbot/tasks/price-check.js >> /root/coinbot/.logs
```

* `*/5 * * * *` means every 5th minute (10h05, 10h10...)
* `. /root/coinbot/.env;` sources the `.env` file. Note the `;` at the end.
* `/usr/local/bin/node /root/coinbot/tasks/price-check.js` launches our task using node
* `>> /root/coinbot/.logs` appends logs to our `.logs` file

## Bot Commands

### `/track`

#### Usage

`/track COIN low high`

Ex: `/track XLM 0.03 0.2` will create an alert for whenever XLM is below 0.03 or above 0.2

### `/price`

#### Usage

`/price COIN`

