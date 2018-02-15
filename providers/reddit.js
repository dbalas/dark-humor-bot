const _ = require('lodash')
const Axios = require('axios')
const DB = require('../db')

function _filterPosts (posts) {
  return new Promise((resolve, reject) => {
    let ids = _.map(posts, post => post.data.id)
    DB.medias.find({
      type: 'reddit',
      id: { $in: ids }
    }, (err, medias) => {
      if (err) return reject(err)
      let savedIds = _.map(medias, post => post.id)
      let filteredPosts = _.filter(posts, post => !savedIds.includes(post.data.id))
      resolve(filteredPosts)
    })
  })
}

function getImage () {
  return new Promise((resolve, reject) => {
    Axios.get('https://www.reddit.com/r/ImGoingToHellForThis/top.json')
      .then(({ data }) => {
        let cleanPosts = _.filter(data.data.children, (post) => {
          return post.data.post_hint === 'image' || post.data.post_hint === 'link'
        })
        _filterPosts(cleanPosts)
          .then((posts) => {
            // Sort by note (likes?)
            posts = _.orderBy(posts, ['score'], ['desc'])
            if (posts.length > 0) {
              let post = posts[0]

              let image = null
              if (post.data.preview && post.data.preview.images) {
                image = post.data.preview.images[0].source.url
              }

              if (!image) return resolve()
              resolve({
                type: 'reddit',
                id: post.data.id,
                caption: post.data.title + ' - ' + `https://reddit.com${post.data.permalink}`,
                from: `https://reddit.com${post.data.permalink}`,
                url: post.data.url
              })
            } else {
              resolve()
            }
          })
          .catch(reject)
      }).catch(reject)
  })
}

module.exports = {
  getImage
}
