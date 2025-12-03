const express = require("express");
const { protect, adminonly } = require("../middleware/authMiddleware");
const {
  getDashboardData,
  getUserDashboardData,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist
} = require("../controller/taskController");

const router = express.Router();

// Dashboard data (Admin)
router.get("/dashboard-data", protect, getDashboardData);

// Dashboard data (User)
router.get("/user-dashboard-data", protect, getUserDashboardData);

// Get all tasks (Admin: all tasks, User: assigned tasks)
router.get("/", protect, getTasks);

// Get task by ID
router.get("/:id", protect, getTaskById);

// Create task (Admin only)
router.post("/", protect, adminonly, createTask);

// Update task
router.put("/:id", protect, updateTask);

// Delete task (Admin only)
router.delete("/:id", protect, adminonly, deleteTask);

// Update task status
router.put("/:id/status", protect, updateTaskStatus);

// Update task checklist
router.put("/:id/todo", protect, updateTaskChecklist);

module.exports = router;
