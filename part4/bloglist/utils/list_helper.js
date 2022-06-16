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
    : blogs.reduce((i, j) => {
      return i.likes >= j.likes
        ? i
        : { title: j.title, author: j.author, likes: j.likes }
    }, {})
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}