const DB = require('./db')

module.exports = {
  addHour (id, hour) {
    return new Promise((resolve, reject) => {
      DB.groups.update({ id }, { $addToSet: { hours: hour } }, {}, (err) => {
        if (err) return reject()
        resolve()
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
