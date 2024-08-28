const Task = require("../models/Task");
const User = require("../models/User")

exports.getAllTasks = async (req, res, next) => {
  const tasks = await Task.find({}).populate('userId')
  res.json(tasks)
};

exports.getTaskById = (req, res, next) => {
  const id = req.params.id;
  Task.findById(id)
    .then((task) => {
      if (task) {
        res.status(200).json(task);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
};

exports.createTask = async (req, res, next) => {
  const { title, description, completed } = req.body
  const { userId } = req

  //sacar userId de request
  try {
    const user = await User.findById(userId)

    if(!description) {
      return res.status(400).json({error: 'required "description" field is missing'});
    }
    
    const newTask = new Task({
      title: title,
      description: description,
      completed: completed || false,
      date: new Date(),
      userId: user.id
    });

    const savedTask = await newTask.save();
    user.tasks = user.tasks.concat(savedTask.id)
    await user.save()

    res.status(201).json(savedTask)
  } catch (err) {
    next(err)
  }
};

exports.updateTask = async (req, res, next) => {
  const id = req.params.id;
  const task = req.body;

  const newTaskInfo = {
    title: task.title,
    description: task.description,
    completed: task.completed,
    date: task.date
  };

  try {
    const result = await Task.findByIdAndUpdate(id, newTaskInfo, {new: true})

    if(result) {
      return res.status(200).json(result)
    }

    res.status(404).end()
  } catch (err) {
    next(err)
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id)
    
    if(!result) {
      return res.status(404).json({message: 'Task not found'})
    }

    res.status(204).json({message: 'Task deleted successfully'})
  } catch (err) {
    next(err)
  }
};