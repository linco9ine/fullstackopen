const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username) {
    return response.status(400).json({ error: "username is required" })
  }

  if (!password) {
    return response.status(400).json({ error: "password is required" })
  }

  if (!(typeof password === 'string' && password.length >= 3)) {
    return response.status(400).json({ error: "password must be at least 3 characters long." })
  }

  if (!(typeof username === 'string' && username.length >= 3)) {
    return response.status(400).json({ error: "username must be at least 3 characters long." })
  }

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

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', '-user -likes')
  response.json(users)
})

module.exports = usersRouter
