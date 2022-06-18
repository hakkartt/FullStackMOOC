const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { title: 1, url: 1, author: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  const users = await User.find({})
  const duplicate = users.find(x => x.username === username)
  console.log(duplicate)
  if (password === undefined || username === undefined ||
    password.length < 3 || username.length < 3 || duplicate) {
    return response.status(400).json({
      error: 'Username and password required (at least 3 char'+
      ' long). Furthermore,  username must be unique!'
    })
  }
  //   const existingUser = await User.findOne({ username })
  //   if (existingUser) {
  //     return response.status(400).json({
  //       error: 'username must be unique'
  //     })
  //   }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash,
  })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = usersRouter