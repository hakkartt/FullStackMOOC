const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

describe('save some initial notes to DB', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('test GET requests', () => {

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

    test('get a single blog with valid "id"', async () => {
      const blogs = await helper.blogsInDb()
      await api
        .get(`/api/blogs/${blogs[0].id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

  })

  describe('test POST requests', () => {

    test('a new valid blog can be added', async () => {
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

    test('a new blog without field "likes" is accepted and "likes" field is set as 0', async () => {
      const newBlog = {
        title: 'Foo Foo or Bar Bar',
        author: 'Foo Bar',
        url: 'http://foo.bar/foo/bar'
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const blogsAfterPost = await helper.blogsInDb()
      expect(blogsAfterPost)
        .toHaveLength(helper.initialBlogs.length + 1)
      expect(blogsAfterPost.map(blog => blog.likes)).toBeDefined()
      expect(blogsAfterPost[blogsAfterPost.length - 1].likes).toBe(0)
    })

    test('a new blog without field "title" is NOT accepted', async () => {
      const newBlog = {
        author: 'Foo Bar',
        url: 'http://foo.bar/foo/bar',
        likes: 100
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
      const blogsAfterPost = await helper.blogsInDb()
      expect(blogsAfterPost)
        .toHaveLength(helper.initialBlogs.length)
    })

    test('a new blog without field "url" is NOT accepted', async () => {
      const newBlog = {
        title: 'Foo Foo or Bar Bar',
        author: 'Foo Bar',
        likes: 100
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
      const blogsAfterPost = await helper.blogsInDb()
      expect(blogsAfterPost)
        .toHaveLength(helper.initialBlogs.length)
    })

  })

  describe('test DELETE requests', () => {

    test('request with valid "id" leads to status code 204', async () => {
      const blogsBeforeDelete = await helper.blogsInDb()
      await api
        .delete(`/api/blogs/${blogsBeforeDelete[0].id}`)
        .expect(204)
      const blogsAfterDelete = await helper.blogsInDb()
      expect(blogsAfterDelete)
        .toHaveLength(blogsBeforeDelete.length - 1)
    })

    test('request with non-existing "id" leads to status code 400', async () => {
      const blogsBeforeDelete = await helper.blogsInDb()
      const id = await helper.nonExistingId()
      await api
        .delete(`/api/blogs/${id}`)
        .expect(204)
      const blogsAfterDelete = await helper.blogsInDb()
      expect(blogsAfterDelete)
        .toHaveLength(blogsBeforeDelete.length)
    })

  })

  describe('test PUT requests', () => {

    test('adding likes to a existing blog', async () => {
      const likesToBeAdded = 5
      const blogs = await helper.blogsInDb()
      const likesBeforeIncrementation = blogs[0].likes
      const response = await api
        .put(`/api/blogs/${blogs[0].id}`)
        .send( { likes: (blogs[0].likes + likesToBeAdded) } )
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body.likes)
        .toBe(likesBeforeIncrementation + likesToBeAdded)
    })

  })

})

afterAll(() => {
  mongoose.connection.close()
})