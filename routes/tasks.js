const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.js");
const userExtractor = require("../middleware/userExtractor");

router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", userExtractor, taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;