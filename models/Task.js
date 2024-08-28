const { Schema, model } = require("mongoose");

const tasksSchema = new Schema({
  title: String,
  description: String,
  completed: Boolean,
  date: Date,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

tasksSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Task = model("Task", tasksSchema);

module.exports = Task;