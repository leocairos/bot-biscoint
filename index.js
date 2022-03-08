
require('dotenv-safe').config();
const axios = require("axios");

const telegram = require('./telegram')

const COIN_PAIRS = process.env.COIN_PAIRS.split(';');
const PERCENT_ALERT = Number(process.env.PERCENT_ALERT);
// Ticker rate limit is 12 per minute => 1 each 5s
const rateInterval = COIN_PAIRS.length * 5100;

async function app() {

    COIN_PAIRS.forEach(async coinPair => {
        const [baseT, quoteT] = coinPair.split('/');
        const tickerUrl = `https://api.biscoint.io/v1/ticker?base=${baseT}&quote=${quoteT}`
        const response = await axios.get(tickerUrl);
        const { base, quote, ask, bid } = response.data.data;
        const percentage = (Number(ask) / Number(bid)) - 1;
        const msg = `${base}/${quote} [${(percentage*100).toFixed(2)}%] ask: ${ask} bid: ${bid}`
        console.log(msg);
        if (percentage >= PERCENT_ALERT) telegram.sendMessage(msg);
    })
}

const msgLog = 
    `App is running with Get in Biscoint API every ${rateInterval/1000} seconds.
    Monitoring Coin Pairs: ${COIN_PAIRS}\n`;

console.log(msgLog);
app();

setInterval(app, rateInterval);

