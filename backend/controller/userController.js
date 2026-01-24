const Task = require("../models/task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//@desc   get all user (Admin only)
//route get/api/users/
//access private(Admin)
// 1. ADD (req, res) HERE
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        // 2. IMPORTANT: Ensure these strings ("Pending") match your Task Schema exactly
        const PendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending", 
        });

        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });

        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user._doc,
          PendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    // 3. NOW 'res' is defined and will work
    res.json(usersWithTaskCounts);
  } catch (error) {
    // 4. NOW 'res' is defined for error handling too
    res.status(500).json({ message: "server error", error: error.message });
  }
};
//@desc get user by id
//@route GET/api/users/:id
//@access private
const getUserById = async () => {
  try {
    const user = await User.findById(req.Params.id).select("-password");
    if (!user) return res.status(404).json({ message: "user not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@desc delete a user (Admin Only)
//route DELETE/api/users/:id
//@access Private (Admin)
const deleteUser = async () => {
  try {
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

module.exports = { getUsers, getUserById, deleteUser };
