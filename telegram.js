
require('dotenv-safe').config();

const { Telegraf } = require("telegraf");
const bot = new Telegraf(`${process.env.BOT_TOKEN}`);
const CHAT_ID = process.env.CHAT_ID;

function sendMessage(message) {
    bot.telegram.sendMessage(CHAT_ID, message);
}

module.exports = { sendMessage };
