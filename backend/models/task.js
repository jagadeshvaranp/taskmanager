const mongoose = require("mongoose");

// Todo Subschema
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true }, // Schema expects 'text'
  completed: { type: Boolean, default: false }, // Schema expects 'completed'
});

// Main Task Schema
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    dueDate: { type: Date, required: true },

    // 🟢 FIXED: Wrapped in [ ] to allow multiple users
    assignedTo: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    attachments: [{ type: String }],

    todoChecklist: [todoSchema],

    progress: { type: Number, default: 0 },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);