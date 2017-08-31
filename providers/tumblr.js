const _ = require('lodash')
const tumblr = require('tumblr.js')
const DB = require('../db')

const client = tumblr.createClient({
  consumer_key: 'M6KrqTV0ejQQ45u87S3HceSbAF3cpryj06ZLopBufks94GAi8P',
  consumer_secret: 'BliolkSDOXKfRhamyT7bXWxHd3QXETs9bqIl21uk1aoGfs0f7g'
})

function _addMedia (post) {
  return new Promise((resolve, reject) => {
    DB.medias.insert({
      id: post.id,
      type: 'tumblr',
      from: post.post_url,
      mediaDate: post.date,
      date: new Date()
    }, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function _filterPosts (posts) {
  return new Promise((resolve, reject) => {
    let ids = _.map(posts, post => post.id)
    DB.medias.find({
      type: 'tumblr',
      id: { $in: ids }
    }, (err, medias) => {
      if (err) return reject(err)
      let savedIds = _.map(medias, post => post.id)
      let filteredPosts = _.filter(posts, post => !savedIds.includes(post.id))
      resolve(filteredPosts)
    })
  })
}

function getImage () {
  let date = new Date()
  date.setDate(date.getDate() - 2)
  date = date.setHours(0)
  return new Promise((resolve, reject) => {
    client.taggedPosts('humor negro', {
      before: date
    }, (err, posts) => {
      if (err) return reject(err)
      let cleanPosts = _.filter(posts, { type: 'photo' })

      // Check medias
      _filterPosts(cleanPosts)
        .then((posts) => {
          // Sort by note (likes?)
          posts = _.orderBy(posts, ['note_count', 'timestamp'], ['asc', 'desc'])
          if (posts.length > 0) {
            let post = posts[0]

            // Save media for checking
            _addMedia(post)
            resolve({
              caption: post.caption || post.summary,
              from: post.short_url,
              url: post.photos[0].original_size.url
            })
          } else {
            reject()
          }
        })
        .catch(reject)
    })
  })
}

module.exports = {
  getImage
}
