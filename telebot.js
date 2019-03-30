const TeleBot = require('telebot')

const bot = new TeleBot({
  token: process.env.TELEGRAM_TOKEN,
  allowedUpdates: []
})

module.exports = bot
