const TeleBot = require('telebot')
const Commands = require('./commands')
const Scheduler = require('./schedule')

const bot = new TeleBot({
  token: '415031266:AAFJLX-EO51CHGB_vYAoWu7khAzHCUTnCSg',
  allowedUpdates: []
})

Commands(bot)
Scheduler(bot)

bot.start()
