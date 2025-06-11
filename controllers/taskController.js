const mongoose = require("mongoose");
const Task = require("../models/Task");

// ✅ Create a Task
exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Create Task Error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    res.status(500).json({ error: "Server error while creating task" });
  }
};

// ✅ Retrieve All Tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Get All Tasks Error:", err);
    res.status(500).json({ error: "Server error while retrieving tasks" });
  }
};

// ✅ Retrieve a Single Task
exports.getTask = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json(task);
  } catch (err) {
    console.error("Get Task Error:", err);
    res.status(500).json({ error: "Server error while retrieving task" });
  }
};

// ✅ Update a Task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }

  try {
    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json(task);
  } catch (err) {
    console.error("Update Task Error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    res.status(500).json({ error: "Server error while updating task" });
  }
};

// ✅ Delete a Task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ error: "Server error while deleting task" });
  }
};
