const _ = require('lodash')
const schedule = require('node-schedule')
const Reddit = require('./providers/reddit')
const Reddit2 = require('./providers/reddit2')
const gag9 = require('./providers/9gag')
const DB = require('./db')

const rule = new schedule.RecurrenceRule()
rule.hour = [new schedule.Range(8, 23)]
rule.minute = 0

function _addMedia (image) {
  return new Promise((resolve, reject) => {
    DB.medias.insert({
      id: image.id,
      type: image.type,
      from: image.from,
      caption: image.caption,
      url: image.url,
      mediaDate: new Date(),
      date: new Date()
    }, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function sendPhoto(bot, id, image) {
  let extension = image.url.trim().toLowerCase()
  extension = extension.substr(extension.length - 3)
  if (extension === 'gif' || extension === 'gifv') {
    bot.sendDocument(
      id,
      image.url, {
        caption: image.from,
        serverDownload: true,
        notification: true
      }).then((result) => {
      console.log('YEAH', result)
    }).catch((err) => {
      console.error('1. GET IMAGE ERROR', err)
    })
  } else {
    bot.sendPhoto(
      id,
      image.url, {
        caption: image.from,
        serverDownload: true,
        notification: true
      }).then((result) => {
      console.log('YEAH', result)
    }).catch((err) => {
      console.error('2. GET IMAGE ERROR', err)
    })
  }

}

function _pickImage(images) {
  let image = null
  images = _.compact(images)
  if (images.length === 1) {
    image = images[0]
  } else if (images.length > 1) {
    let random = _.random(0, 5) // Más probabilidad para 9gag
    if (random > 1) image = images[1]
    else image = images[0]
  }
  return image
}

let prevHour;
function exec (bot) {
  let date = new Date()
  let hour = date.getHours() + ':00'
  console.log('Invocation: ', hour)
  // Nasty guard
  if (prevHour === hour) return
  prevHour = hour
  DB.groups.find({
    hours: hour,
    isActive: true
  }, (err, groups) => {
    if (err) return console.error(err)
    // Get the shit here man
    Promise.all([
      Reddit.getImage(),
      Reddit2.getImage()
      // gag9.getImage()
      // Tumbrl.getImage()
    ]).then((images) => {
      let image = _pickImage(images)
      if (!image) throw new Error('no-image')
      _addMedia(image)
      groups.forEach((group) => {
        bot.sendPhoto(
          group.id,
          image.url, {
            caption: image.caption,
            serverDownload: true,
            notification: true
          }
        ).then((result) => {
          console.log('YEAH', result)
        }).catch((err) => {
          console.error(image, '3. GET IMAGE ERROR', err)
        })
      })
    }).catch((err) => {
      console.error(err)
    })
  })
}
module.exports = (bot) => {
  const job = schedule.scheduleJob(rule, () => {
    exec(bot)
  })

  let date = new Date(job.nextInvocation())
  console.log('Next invocation: ', date.getHours())
}
