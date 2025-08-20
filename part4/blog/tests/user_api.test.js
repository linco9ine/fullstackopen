const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')
const assert = require('node:assert')
const mongoose = require('mongoose')
const { describe, test, beforeEach, after } = require('node:test')

const api = supertest(app)

describe('/api/users', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const user1 = new User({ username: "tomi", password: "tom1234", name: "thomas" })
    const user2 = new User({ username: "jo12", password: "john0d0e", name: "Johnatan" })

    await user1.save()
    await user2.save()
  })

  test('with the expected input a user can be created', async () => {
    const user = { username: "robb", password: "robb1234", name: "Ruben" }

    const initialUsers = await api
      .get('/api/users')
      .expect(200)


    const createdUser = await api
      .post('/api/users')
      .send(user)
      .expect(201)

    assert.strictEqual(createdUser.body.username, user.username)

    const usersAfterInsertion = await api
      .get('/api/users')
      .expect(200)

    assert.strictEqual(usersAfterInsertion.body.length, initialUsers.body.length + 1)
  })

  test('a username length less than 3 is not acceptable', async () => {
    const user = { username: "ro", password: "robb1234", name: "Ruben" }

    await api
      .post('/api/users')
      .send(user)
      .expect(400)
  })

  test('a password length less than 3 is not acceptable', async () => {
    const user = { username: "robb", password: "ro", name: "Ruben" }

    await api
      .post('/api/users')
      .send(user)
      .expect(400)
  })

  test('if username or password is missing then it is bad request', async () => {
    let user = {password: "ro1234", name: "Ruben" }

    await api
      .post('/api/users')
      .send(user)
      .expect(400)

    user = { username: "robb", name: "Ruben" }

    await api
      .post('/api/users')
      .send(user)
      .expect(400)
  })
})

after(async () => {
  mongoose.connection.close()
})
