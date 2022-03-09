
require('dotenv-safe').config();
const axios = require("axios");

const telegram = require('./telegram')

const COIN_PAIRS = process.env.COIN_PAIRS.split(';');
const PERCENT_ALERT = Number(process.env.PERCENT_ALERT);
// Ticker rate limit is 12 per minute => 1 each 5s
const rateInterval = COIN_PAIRS.length * 5100;
const averageOf = Number(process.env.INTERVAL_ALERT) / 5100;
const prices = [];

function coinCalc() {
    const coins = [];
    prices.forEach( coin => {
        const index = coins.findIndex( c => c.coinPair === coin.coinPair);
        if (index >= 0){
            if (coin.percentage > coins[index].max) coins[index].max = coin.percentage;
            if (coin.percentage < coins[index].min) coins[index].min = coin.percentage;
            coins[index].avg = (coins[index].avg + coin.percentage) / 2;
        } else {
            const coinPair = coin.coinPair;
            const max = coin.percentage;
            const min = coin.percentage;
            const avg = coin.percentage;
            coins.push({coinPair, max, min, avg});
        }
    })
    return coins;
}

function formatMsgCalc(calc){
    let msg = `Result of the last ${Number(process.env.INTERVAL_ALERT)/1000/60} `
    msg += `minutes of price change monitoring:\n`;
    calc.forEach( c => {
        msg += `  -> ${c.coinPair} avg: ${(c.avg*100).toFixed(2)}% `
        msg += `min: ${(c.min*100).toFixed(2)} `
        msg += `max: ${(c.max*100).toFixed(2)}\n`
    })
    return msg;
}

// Average, Max and Min prices by coinPair
function processPrices(coinPair, percentage) {
    prices.push({coinPair, percentage});
    if (prices.length >= averageOf) {
        const calc = coinCalc();
        console.log(formatMsgCalc(calc));
        telegram.sendMessage(formatMsgCalc(calc));
        prices.length = 0;
    }
}

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
        processPrices(coinPair, percentage);
    })
}

const msgLog = 
    `App is running with Get in Biscoint API every ${rateInterval/1000} seconds.
    Monitoring Coin Pairs: ${COIN_PAIRS}\n`;

console.log(msgLog);
app();

setInterval(app, rateInterval);

