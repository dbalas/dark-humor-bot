const _ = require('lodash')
const gag = require('node-9gag')
const DB = require('../db')

function _filterPosts (posts) {
  return new Promise((resolve, reject) => {
    let ids = _.map(posts, post => post.id)
    DB.medias.find({
      type: '9gag',
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
  return new Promise((resolve, reject) => {
    gag.section('darkhumor', (err, res) => {
      if (err) return reject(err)
      let cleanPosts = _.filter(res, 'image')

      // Check medias
      _filterPosts(cleanPosts)
        .then((posts) => {
          // Sort by note (likes?)
          posts = _.orderBy(posts, ['points'], ['desc'])
          if (posts.length > 0) {
            let post = posts[0]

            // Save media for checking
            resolve({
              type: '9gag',
              id: post.id,
              caption: post.title + ' ' + post.url,
              from: post.url,
              url: post.image
            })
          } else {
            resolve()
          }
        })
        .catch(reject)
    })
  })
}

module.exports = {
  getImage
}
