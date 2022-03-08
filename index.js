
require('dotenv-safe').config();

const axios = require("axios");

const telegram = require('./telegram')

const COIN_PAIRS = process.env.COIN_PAIRS.split(';');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function app() {

    COIN_PAIRS.forEach(async coinPair => {
        const [baseT, quoteT] = coinPair.split('/');
        const tickerUrl = `https://api.biscoint.io/v1/ticker?base=${baseT}&quote=${quoteT}`
        const response = await axios.get(tickerUrl);
        const { base, quote, ask, bid } = response.data.data;
        const percentage = (Number(ask) / Number(bid)) - 1;
        const msg = `CoindPair: ${base}/${quote} [${percentage.toFixed(3)}%] ask: ${ask} \tbid: ${bid}`
        console.log(msg);
        //telegram.sendMessage(msg);
        await delay(3000);
    })
}

const msgLog = 
    `App is running with Get in Biscoint API every ${process.env.GET_API_INTERVAL/1000} seconds.
    Monitoring Coin Pairs: ${COIN_PAIRS}\n`;

console.log(msgLog);
app();
setInterval(app, process.env.GET_API_INTERVAL || 5000);

