const Actions = require('./actions')

function S (data) {
  return JSON.stringify(data)
}

function P (data) {
  return JSON.parse(data)
}

const HOURS = [['7:00', '8:00', '9:00'], ['10:00', '11:00', '12:00'], ['13:00', '14:00', '15:00'], ['16:00', '17:00', '18:00'], ['19:00', '20:00', '21:00'], ['22:00', '23:00']]

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

function _listarl (bot, chatId) {
  Actions.getHours(chatId)
    .then((hours) => {
      let replyMarkup = _showToggleHours(bot, hours)
      bot.sendMessage(chatId, 'Horicas ricas hoiga', { replyMarkup })
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
  bot.on('/daleh', (msg) => {
    let chatId = msg.chat.id
    Actions.createSchedule(chatId)
      .then((schedule) => {
        bot.sendMessage(chatId, '¡Hola! Soy el bot de Tumor Negro, me encargaré de mandarte mierda de la buena cada día. \n Puedes ver todos los comandos y más info en /ajuda')
        setTimeout(() => {
          _listarl(bot, chatId)
        }, 1000)
      })
      .catch((err) => {
        bot.sendMessage(chatId, 'ERROR')
        console.error(err)
      })
  })

  bot.on('/ajuda', (msg) => {
    let chatId = msg.chat.id
    bot.sendMessage(chatId, `Comandous disponibeles:\n
      /daleh -> Configura el envio de farlopa y muestra el selector de horas.\n
      /ajuda -> Muestra este mensaje de mierda.\n
      /infoplis-> Muestra info sobre el bot y su creador.\n
      /listarl -> Lista las horas configuradas y permite activar/desactivar una hora.\n
      /chapar -> Desactiva temporalmente el bot.\n
      /deschapar -> Activa de nuevo el bot.`)
  })

  bot.on('/infoplis', (msg) => {
    let chatId = msg.chat.id
    bot.sendMessage(chatId, `Hola, soy un robot programado para enviar a este grupo bromas, memes o a lo que mi creador le de la gana, a ciertas horas eso sí, de momento es lo que hay.\nSi tienes alguna pregunta o sugerencia te la puedes meter por el culo o enviar un correo a tumornegrobot@gmail.com\n(ya existe!)`)
    bot.sendMessage(chatId, `Si además te sientes generoso y quieres ayudar a mantener el servidor (o invitarme a una cerveza) puedes hacer tu donación en: https://www.paypal.me/TumorNegroBot`)
  })

  bot.on('/dameargo', (msg) => {
    let chatId = msg.chat.id
    bot.sendMessage(chatId, `Si te sientes generoso y quieres ayudar a mantener el servidor (o invitarme a una cerveza) puedes hacer tu donación en: https://www.paypal.me/TumorNegroBot`)
  })

  bot.on('/listarl', (msg) => {
    let chatId = msg.chat.id
    _listarl(bot, chatId)
  })

  bot.on('/chapar', (msg) => {
    let chatId = msg.chat.id
    Actions.setActive(chatId, false)
      .then(() => {
        bot.sendMessage(chatId, 'Vale 🖕')
      })
      .catch((err) => {
        console.error(err)
      })
  })

  bot.on('/deschapar', (msg) => {
    let chatId = msg.chat.id
    Actions.setActive(chatId, true)
      .then(() => {
        bot.sendMessage(chatId, 'Bien!!!! B=====D💦')
      })
      .catch((err) => {
        console.error(err)
      })
  })

  bot.on('callbackQuery', msg => {
    let chatId = msg.message.chat.id
    let payload = P(msg.data)
    Actions[payload.action](bot, msg, payload.data)
      .then((result) => {
        bot.answerCallbackQuery(msg.id)
        // Nasty
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
      })
      .catch((err) => {
        bot.sendMessage(chatId, 'ERROR')
        console.error(err)
      })
  })

  bot.on('/heil_hitler', (msg) => {
    let chatId = msg.chat.id
    bot.sendMessage(chatId, 'Heil Marcos!')
  })
}
