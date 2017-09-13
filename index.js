const bot = require('./Telebot')
const Commands = require('./commands')
const Scheduler = require('./schedule')

Commands(bot)
Scheduler(bot)

bot.start()
