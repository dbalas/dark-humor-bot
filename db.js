const Datastore = require('nedb')
const db = {}

// Datastores
db.groups = new Datastore({
  filename: './db/groups.db',
  autoload: true
})

db.medias = new Datastore({
  filename: './db/medias.db',
  autoload: true
})

// Indexes
db.groups.ensureIndex({ fieldName: 'id', unique: true }, (err) => {
  if (err) console.error(err)
})

db.medias.ensureIndex({ fieldName: 'id', unique: true }, (err) => {
  if (err) console.error(err)
})

module.exports = db
