const express = require("express");
const { protect, adminonly } = require("../middleware/authMiddleware");
const { getUsers, getUserById, deleteUser } = require("../controller/userController");

const router = express.Router();

// Get all users (Admin only)
router.get("/", protect, adminonly, getUsers);

// Get a specific user by ID
router.get("/:id", protect, getUserById);

// Delete a user (Admin only)
router.delete("/:id", protect, adminonly, deleteUser);

module.exports = router;
