const lodash = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((total, i) => (total + i.likes), 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? {}
    : blogs.reduce((i, next) => {
      return i.likes >= next.likes
        ? i
        : { title: next.title, author: next.author, likes: next.likes }
    }, {})
}

const mostBlogs = (blogs) => {
  return blogs.length === 0
    ? {}
    : lodash(blogs)
      .groupBy('author')
      .map((listOfBlogs, author) => {
        return { author: author, blogs: listOfBlogs.length }
      })
      .value()
      .reduce((i, next) => {
        return i.blogs >= next.blogs
          ? i
          : next
      }, {})
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}