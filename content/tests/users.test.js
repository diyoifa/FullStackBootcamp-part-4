const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const mongoose = require('mongoose')

describe('when there is initially one user at db', () => {

  beforeEach(async() => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username:'root', passwordHash })
    await user.save()
  }, 10000)

  test.only('creation succeeds with a fresh username', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username:'test',
      name:'testing',
      password:'123',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length+1)

    const usernames = usersAtEnd.map(u => u.username)

    expect(usernames).toContain(result.body.username)
  })


})

afterAll(() => {
  mongoose.connection.close()
})