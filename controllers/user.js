const bcrypt = require('bcrypt')
const User = require('../models/User')

exports.getAllUsers = async (req, res) => {
  try { 
    const users = await User.find({tittle: "Task 40"})
    res.status(200).json(users)
  } catch (err) {
    res.json({err})
  }
}

exports.createUser = async (req, res) => {
  try {
    const { username, name, password } = req.body
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({ 
      username, 
      name,
      passwordHash
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
  } catch (err) {
    res.status(409).json(err.message)
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id)
    if(!result) {
      return res.status(404).json({message: "User not found"})
    }
    res.status(204).json({message: "User deleted successfully"})
  } catch (err) {
    res.status(400).json(err)
  }
}