const Actions = require('./actions')

function S (data) {
  return JSON.stringify(data)
}

function P (data) {
  return JSON.parse(data)
}

const HOURS = [
  ['7:00', '8:00', '9:00'],
  ['10:00', '11:00', '12:00'],
  ['13:00', '14:00', '15:00'],
  ['16:00', '17:00', '18:00'],
  ['19:00', '20:00', '21:00'],
  ['22:00', '23:00']
]

function _showToggleHours (bot, hours) {
  let hourButtons = HOURS.map((hourRow) => {
    return hourRow.map((hour) => {
      let btnMsg = (hours.includes(hour)) ? `${hour} ✅` : hour
      return bot.inlineButton(btnMsg, {
        callback: S({
          action: 'toggleHour',
          data: hour
        })
      })
    })
  })
  return bot.inlineKeyboard(hourButtons)
}

function _list (bot, chatId) {
  Actions.getHours(chatId)
    .then((hours) => {
      let replyMarkup = _showToggleHours(bot, hours)
      bot.sendMessage(chatId, 'Hours', { replyMarkup })
        .then(() => {})
        .catch((err) => {
          console.error(err)
        })
    })
    .catch((err) => {
      console.error(err)
    })
}

module.exports = (bot) => {
  bot.on('/init', (msg) => {
    let chatId = msg.chat.id
    Actions.createSchedule(chatId)
      .then((schedule) => {
        bot.sendMessage(chatId, '¡Hello! I\'m a dark humor bot, I will send you good shit everyday. \n You can see all commands and more info with command /help')
        setTimeout(() => {
          _list(bot, chatId)
        }, 1000)
      })
      .catch((err) => {
        bot.sendMessage(chatId, 'ERROR')
        console.error(err)
      })
  })

  bot.on('/help', (msg) => {
    let chatId = msg.chat.id
    bot.sendMessage(chatId, `Commands:\n
      /init -> Make initial config and show the hour selector.\n
      /help -> Shows this shit message.\n
      /info -> Shows information about the bot and its creator..\n
      /donate -> Shows info for make a donation.\n
      /list -> List and manage configurated hours.\n
      /enable -> Bot enable.\n
      /disable -> Bot disable.`)
  })

  bot.on('/info', (msg) => {
    let chatId = msg.chat.id
    bot.sendMessage(chatId, `Hello, I'm a bot programmed to send to this group jokes, memes or whatever my creator wants at certain hours.`)
  })

  /* bot.on('/donate', (msg) => {
    let chatId = msg.chat.id
    bot.sendMessage(chatId, ``)
  }) */

  bot.on('/list', (msg) => {
    let chatId = msg.chat.id
    _list(bot, chatId)
  })

  bot.on('/disable', (msg) => {
    let chatId = msg.chat.id
    Actions.setActive(chatId, false).then(() => {
      bot.sendMessage(chatId, 'Ok... 🖕')
    }).catch((err) => {
      console.error(err)
    })
  })

  bot.on('/enable', (msg) => {
    let chatId = msg.chat.id
    Actions.setActive(chatId, true).then(() => {
      bot.sendMessage(chatId, 'Good!!!! B=====D💦')
    }).catch((err) => {
      console.error(err)
    })
  })

  bot.on('callbackQuery', msg => {
    let chatId = msg.message.chat.id
    let payload = P(msg.data)
    Actions[payload.action](bot, msg, payload.data).then(() => {
      bot.answerCallbackQuery(msg.id)
      if (payload.action === 'toggleHour') {
        Actions.getHours(chatId)
          .then((hours) => {
            let replyMarkup = _showToggleHours(bot, hours)
            bot.editMessageReplyMarkup({
              chatId: chatId,
              messageId: msg.message.message_id
            }, { replyMarkup })
              .then(() => {})
              .catch((err) => {
                console.error(err)
              })
          })
          .catch((err) => {
            console.error(err)
          })
      }
    }).catch((err) => {
      bot.sendMessage(chatId, 'ERROR')
      console.error(err)
    })
  })
}
