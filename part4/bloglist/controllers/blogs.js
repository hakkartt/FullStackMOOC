const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const blog = await new Blog(request.body)
  try {
    const toBePosted = await blog.save()
    response.status(201).json(toBePosted)
  } catch(error) {
    next(error)
  }
})

module.exports = blogRouter