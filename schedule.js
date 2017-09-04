const _ = require('lodash')
const schedule = require('node-schedule')
const Tumbrl = require('./providers/tumblr')
const gag9 = require('./providers/9gag')
const DB = require('./db')

const rule = new schedule.RecurrenceRule()
rule.hour = [new schedule.Range(8, 23)]
rule.minute = 0

function sendPhoto(bot, id, image) {
  let extension = image.url.trim().toLowerCase()
  extension = extension.substr(extension.length - 3)
  if (extension === 'gif') {
    bot.sendDocument(
      id,
      image.url, {
        caption: image.from,
        serverDownload: true,
        notification: true
      }).then((result) => {
      console.log('YEAH', result)
    }).catch((err) => {
      console.error('GET IMAGE ERROR', err)
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
      console.error('GET IMAGE ERROR', err)
    })
  }

}

function _pickImage(images) {
  let image = null
  images = _.compact(images)
  if (images.length === 1) {
    image = images[0]
  } else if (images.length > 1) {
    let random = _.random(0, images.length - 1)
    image = images[random]
  }
  return image
}

module.exports = (bot) => {
  const job = schedule.scheduleJob(rule, () => {
    let date = new Date()
    let hour = date.getHours() + ':00'
    console.log('Invocation: ', hour)
    DB.groups.find({
      hours: hour,
      isActive: true
    }, (err, groups) => {
      if (err) return console.error(err)
      // Get the shit here man
      Promise.all([
        gag9.getImage(),
        Tumbrl.getImage()
      ]).then((images) => {
        let image = _pickImage(images)
        if (!image) throw new Error('no-image')
        groups.forEach((group) => {
          bot.sendPhoto(
            group.id,
            image.url, {
              caption: image.from,
              serverDownload: true,
              notification: true
            }
          ).then((result) => {
            console.log('YEAH', result)
          }).catch((err) => {
            console.error('GET IMAGE ERROR', err)
          })
        })
      }).catch((err) => {
        console.error(err)
      })
    })
  })

  let date = new Date(job.nextInvocation())
  console.log('Next invocation: ', date.getHours())
}
