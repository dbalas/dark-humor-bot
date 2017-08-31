const schedule = require('node-schedule')
const Tumbrl = require('./providers/tumblr')
const DB = require('./db')

const rule = new schedule.RecurrenceRule()
rule.hour = [new schedule.Range(8, 23)]
rule.minute = 0

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
      Tumbrl.getImage()
        .then((image) => {
          groups.forEach((group) => {
            let caption = (image.caption) ? `${image.caption} - ${image.from}` : image.from
            bot.sendPhoto(
              group.id,
              image.url,
              {
                caption,
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
