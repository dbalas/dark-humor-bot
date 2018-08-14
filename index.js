require('dotenv').config()
const bot = require('./telebot')
const Commands = require('./commands')
const Scheduler = require('./schedule')

Commands(bot)
Scheduler(bot)

bot.start()
