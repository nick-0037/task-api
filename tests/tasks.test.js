const mongoose = require('mongoose')
const { server } = require('../index')
const { api, initialTasks, getAllContentFromTasks } = require('./helpers')
const Task = require('../models/Task');
const jwt = require('jsonwebtoken')

beforeEach(async () => {
  await Task.deleteMany({})

  // sequential
  for(const task of initialTasks) {
    const taskObject = new Task(task)
    await taskObject.save()
  }
})

describe('getting tasks', () => {
  test('tasks are returned as json', async () => {
    await api
      .get('/api/tasks')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  })
  
  test('there are two task', async () =>{
    const response = await api.get('/api/tasks')
    expect(response.body).toHaveLength(initialTasks.length)
  })
  
  test('the first task is about nickdev', async () => {
    const { descriptions } = await getAllContentFromTasks()
    expect(descriptions).toContain('nickdev es un buen developer')
  })
})

describe('checking tasks for add ', () => {
  test('a task with description is added and userId', async () => {
    const userId = "66a1ea1438fa71f0c41bfc0d"
    const token = jwt.sign({ id: userId }, process.env.SECRET);
    const newTask = {
      title: "title 3",
      description: 'description 3',
      userId: userId
    }
    
    await api
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(newTask)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const { response, descriptions } = await getAllContentFromTasks()
    expect(response.body).toHaveLength(initialTasks.length + 1)
    expect(descriptions).toContain(newTask.description)
  })

  test('a task without description is not added', async () => {
    const userId = "66a1ea1438fa71f0c41bfc0d";
    const token = jwt.sign({ id: userId }, process.env.SECRET);
    const newTask = {
      title: "title 4"
    }

    await api
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(newTask)
      .expect(400)
      .expect('Content-type', /application\/json/)
    const { response } = await getAllContentFromTasks()
    expect(response.body).toHaveLength(initialTasks.length)
  })
})

describe('checking tasks for deleted', () => {
  test('a task can be deleted', async () => {
    const { response: firstResponse } = await getAllContentFromTasks()
    const { body: tasks  } = firstResponse
    const taskToDelete = tasks[0]
  
    await api
      .delete(`/api/tasks/${taskToDelete.id}`)
      .expect(204)
      
      const { descriptions, response: secondResponse } = await getAllContentFromTasks()
      expect(secondResponse.body).toHaveLength(initialTasks.length - 1)
      expect(descriptions).not.toContain(taskToDelete.description)
  })
  
  test('a task that do not exist can not be deleted', async () => {
    await api
      .delete(`/api/tasks/14545`)
      .expect(400)
      
      const { response } = await getAllContentFromTasks()
      expect(response.body).toHaveLength(initialTasks.length)
  })
})

describe('updates checking', () => {
  test('a task can be update', async () => {
    const { tasks } = await getAllContentFromTasks()
    const taskToUpdate = tasks[2]
    const newTaskData = {
      title: "task 4",
      description: "description 4",
    }

    await api
      .put(`/api/tasks/${taskToUpdate.id}`)
      .send(newTaskData)
      .expect(200)

      const { tasks: updatedTasks } = await getAllContentFromTasks()
      const updatedTask = updatedTasks.find(task => task.id === taskToUpdate.id)

      expect(updatedTask.title).toBe(newTaskData.title)
      expect(updatedTask.description).toBe(newTaskData.description)
      expect(updatedTasks).toHaveLength(initialTasks.length)
  })

  test('a task that do not exist can be not update', async () => {
    const newTaskData = {
      title: "task 5",
      description: "description 5",
    }
    const notExistentId = new mongoose.Types.ObjectId();

    await api
      .put(`/api/tasks/${notExistentId}`)
      .send(newTaskData)
      .expect(404)
  })
})

afterAll(() => {
  console.log('Closing database connection...');
  mongoose.connection.close();
  console.log('Database connection closed.');
  server.close();
})