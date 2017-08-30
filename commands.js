const Actions = require('./actions')
const DB = require('./db')

function S (data) {
  return JSON.stringify(data)
}

function P (data) {
  return JSON.parse(data)
}

const HOURS = [['8:00', '9:00', '10:00', '11:00'], ['12:00', '13:00', '14:00', '15:00'], ['16:00', '17:00', '18:00', '19:00'], ['20:00', '21:00', '22:00', '23:00']]

function _showHours(bot, id) {
  let hourButtons = HOURS.map((hourRow) => {
    return hourRow.map((hour) => {
      return bot.inlineButton(hour, {
        callback: S({
          action: 'addHour',
          data: hour
        })
      })
    })
  })

  let replyMarkup = bot.inlineKeyboard(hourButtons)
  bot.sendMessage(id, 'Selecciona algunas horas (luego puedes desactivarlas utilizando /oras tranquilo ioputa)', { replyMarkup })
}

module.exports = (bot) => {
  bot.on('/daleh', (msg) => {
    let chatId = msg.chat.id
    Actions.createSchedule(chatId)
      .then((schedule) => {
        bot.sendMessage(chatId, '¡Hola! Soy el bot de Tumor Negro, me encargaré de mandarte mierda de la buena cada día. \n Puedes ver todos los comandos y más info en /ajuda')
        setTimeout(() => {
          _showHours(bot, chatId)
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
    bot.sendMessage(chatId, `Hola, soy un robot programado para enviar a este grupo bromas, memes o a lo que mi creador le de la gana, a ciertas horas eso sí, de momento es lo que hay.\nSi tienes alguna pregunta o sugerencia te la puedes meter por el culo o enviar un correo a melasuda@gemail.com\n(puede que este correo cambie y exista.)`)
  })

  bot.on('/listarl', (msg) => {
    let chatId = msg.chat.id
    // TODO
    bot.sendMessage(chatId, 'TODO 🛠')
  })

  bot.on('/chapar', (msg) => {
    let chatId = msg.chat.id
    // TODO
    bot.sendMessage(chatId, 'TODO 🛠')
  })

  bot.on('/deschapar', (msg) => {
    let chatId = msg.chat.id
    // TODO
    bot.sendMessage(chatId, 'TODO 🛠')
  })

  bot.on('callbackQuery', msg => {
    // User message alert
    let chatId = msg.message.chat.id
    let payload = P(msg.data)
    Actions[payload.action](chatId, payload.data)
      .then((result) => {
        bot.sendMessage(chatId, `${payload.data} analdida 👍`)
        bot.answerCallbackQuery(msg.id)
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
