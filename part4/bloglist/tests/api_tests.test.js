const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog has a field "id"', async () => {
  const response = await api
    .get('/api/blogs')
  response.body.map(blog => expect(blog.id).toBeDefined())
})

test('a new valid blog can be added ', async () => {
  const newBlog = {
    title: 'Foo Foo or Bar Bar',
    author: 'Foo Bar',
    url: 'http://foo.bar/foo/bar',
    likes: 100
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfterPost = await helper.blogsInDb()
  expect(blogsAfterPost)
    .toHaveLength(helper.initialBlogs.length + 1)
  expect(blogsAfterPost.map(blog => blog.title)).toContain(
    'Foo Foo or Bar Bar'
  )
})

afterAll(() => {
  mongoose.connection.close()
})