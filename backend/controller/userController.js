const Task = require("../models/task");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

//@desc   get all user (Admin only)
//route get/api/users/
//access private(Admin)
const getUsers = async () => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    //add task count to each users
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const PendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "completed",
        });

         return {
            ...user._doc,
            PendingTasks,
            inProgressTasks,
            completedTasks
        };
      })
    );

    res.json(usersWithTaskCounts)
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@desc get user by id
//@route GET/api/users/:id
//@access private
const getUserById = async () => {
  try {
    const user =await User.findById(req.Params.id).select("-password")
    if(!user) return res.status(404).json({message:"user not found"})
        res.json(user)
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
