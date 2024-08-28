const { app } = require('../index');
const supertest = require('supertest');
const User = require('../models/User')

const api = supertest(app)

const initialTasks = [
  {
    title: 'task 1',
    description: 'nickdev es un buen developer',
    completed: false,
    date: "4254363"
  },
  {
    title: 'task 2',
    description: 'task2 description',
    completed: true,
    date: "5265346"
  },
  {
    title: 'task 5',
    description: 'task5 description',
    completed: false,
    date: "52653463"
  }
]

const getAllContentFromTasks = async () => {
  const response = await api.get('/api/tasks')
  return {
    descriptions: response.body.map(task => task.description),
    response,
    tasks:  response.body
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  api,
  initialTasks,
  getAllContentFromTasks,
  getUsers
}