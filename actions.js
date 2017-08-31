const DB = require('./db')

module.exports = {
  addHour (bot, msg, hour) {
    return new Promise((resolve, reject) => {
      let id = msg.message.chat.id
      DB.groups.update({ id }, { $addToSet: { hours: hour } }, {}, (err) => {
        if (err) return reject(err)
        bot.sendMessage(id, `${hour} analdida 👍`)
        resolve()
      })
    })
  },
  toggleHour (bot, msg, hour) {
    return new Promise((resolve, reject) => {
      let id = msg.message.chat.id
      DB.groups.findOne({ id }, (err, group) => {
        if (err) return reject(err)

        let upQuery
        if (group.hours.includes(hour)) {
          upQuery = { $pull: { hours: hour } }
        } else {
          upQuery = { $addToSet: { hours: hour } }
        }

        DB.groups.update({ id }, upQuery, {}, (err) => {
          if (err) return reject(err)
          resolve()
        })
      })
    })
  },
  setActive (id, isActive) {
    return new Promise((resolve, reject) => {
      DB.groups.update({ id }, { $set: { isActive } }, {}, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  },
  getHours (id) {
    return new Promise((resolve, reject) => {
      DB.groups.findOne({ id }, (err, group) => {
        if (err) return reject(err)
        resolve(group.hours)
      })
    })
  },
  createSchedule (groupId) {
    return new Promise((resolve, reject) => {
      DB.groups.insert({
        id: groupId,
        date: new Date(),
        hours: [],
        isActive: true
      }, (err, newDoc) => {
        if (err && err.errorType === 'uniqueViolated') {
          resolve()
        } else if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
