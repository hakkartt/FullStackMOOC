const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, user: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.status(200).json(blog)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = await new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    user: user._id,
    likes: request.body.likes || 0
  })
  const toBePosted = await blog.save()
  user.blogs = user.blogs.concat(toBePosted._id)
  await user.save()
  response.status(201).json(toBePosted)
})

blogsRouter.delete('/:id', async (request, response) => {
  const tokenUser = request.token === undefined
    ? false
    : jwt.verify(request.token, process.env.SECRET)
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(400).json({ 'error': 'blog not found, malformatted id' })
  }
  if ( tokenUser.id && blog.user && (blog.user.toString() === tokenUser.id.toString()) ) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
  return response.status(401).json({ 'error': 'user unauthorized to delete the blog' })
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    'likes': body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true, runValidators: true }
  )
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter