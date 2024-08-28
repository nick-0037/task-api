const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, getUsers } = require('./helpers')

const mongoose = require('mongoose')
const { server } = require('../index')

test('getAllUser', async () => {
  await api 
    .get('/api/users')
    .expect(200)
    .expect('Content-type', /application\/json/)
})


describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("pswd", 10)
    const passwordHash2 = await bcrypt.hash("pswd2", 10);

    const user = new User({username: "chrisft", passwordHash})
    const user2 = new User({ username: "user2", passwordHash: passwordHash2 });
    await user.save()
    await user2.save()
  })

  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers() 

    const newUser = {
      username: "Luisit0",
      name: "Luis",
      password: "tw1tch"
    }

    await api 
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already exists', async () => {
    const usersAtStart = await getUsers()
    const newUser = {
      username: "chrisft",
      name: "Chris",
      password: "1234"
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(409)
      .expect('Content-type', /application\/json/)

    expect(result.body.errors.username.message).toContain('`username` to be unique')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

describe('deleted a user', () => {
  test('succeeds with statuscode 204 if id is valid', async () => {
    const usersAtStart = await getUsers()
    const userToDelete = usersAtStart[0]

    await api
      .delete(`/api/users/${userToDelete.id}`)
      .expect(204)
    
    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length - 1)
  })
})

afterAll(() => {
  mongoose.connection.close();
  console.log('Database connection closed.');
  server.close();
})