const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('save some initial notes to DB', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    const saltRounds = 10
    const passwordHash = await bcrypt.hash('salainen', saltRounds)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
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
      const users = await helper.usersInDb()
      const newBlog = {
        title: 'Foo Foo or Bar Bar',
        author: 'Foo Bar',
        url: 'http://foo.bar/foo/bar',
        userId: `${users[0].id}`,
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
      const users = await helper.usersInDb()
      const newBlog = {
        title: 'Foo Foo or Bar Bar',
        author: 'Foo Bar',
        url: 'http://foo.bar/foo/bar',
        userId: `${users[0].id}`
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
      const users = await helper.usersInDb()
      const newBlog = {
        author: 'Foo Bar',
        url: 'http://foo.bar/foo/bar',
        userId: `${users[0].id}`,
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
      const users = await helper.usersInDb()
      const newBlog = {
        title: 'Foo Foo or Bar Bar',
        author: 'Foo Bar',
        userId: `${users[0].id}`,
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

describe('after one user is created in DB', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    const saltRounds = 10
    const passwordHash = await bcrypt.hash('salainen', saltRounds)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('create user successfully', async () => {
    const before = await helper.usersInDb()
    const toBeCreated = {
      username: 'foo',
      name: 'bar',
      password: 'foobar'
    }
    await api
      .post('/api/users')
      .send(toBeCreated)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const after = await helper.usersInDb()
    expect(after).toHaveLength(before.length + 1)
    const usernames = after.map(user => user.username)
    expect(usernames).toContain(toBeCreated.username)
  })

  test('creating user with nonunique username fails', async () => {
    const before = await helper.usersInDb()
    const toBeCreated = {
      username: 'root',
      password: 'foobar'
    }
    await api
      .post('/api/users')
      .send(toBeCreated)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const after = await helper.usersInDb()
    expect(after).toHaveLength(before.length)
  })

  test('creating user without username fails', async () => {
    const before = await helper.usersInDb()
    const toBeCreated = {
      password: 'foobar'
    }
    await api
      .post('/api/users')
      .send(toBeCreated)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const after = await helper.usersInDb()
    expect(after).toHaveLength(before.length)
  })

  test('creating user with too short username fails', async () => {
    const before = await helper.usersInDb()
    const toBeCreated = {
      username: 'fo',
      password: 'foobar'
    }
    await api
      .post('/api/users')
      .send(toBeCreated)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const after = await helper.usersInDb()
    expect(after).toHaveLength(before.length)
    const usernames = after.map(user => user.username)
    expect(usernames).not.toContain(toBeCreated.username)
  })

  test('creating user without password fails', async () => {
    const before = await helper.usersInDb()
    const toBeCreated = {
      username: 'foobar'
    }
    await api
      .post('/api/users')
      .send(toBeCreated)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const after = await helper.usersInDb()
    expect(after).toHaveLength(before.length)
    const usernames = after.map(user => user.username)
    expect(usernames).not.toContain(toBeCreated.username)
  })

  test('creating user with too short password fails', async () => {
    const before = await helper.usersInDb()
    const toBeCreated = {
      username: 'foobar',
      password: 'ba'
    }
    await api
      .post('/api/users')
      .send(toBeCreated)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const after = await helper.usersInDb()
    expect(after).toHaveLength(before.length)
    const usernames = after.map(user => user.username)
    expect(usernames).not.toContain(toBeCreated.username)
  })

})

afterAll(() => {
  mongoose.connection.close()
})