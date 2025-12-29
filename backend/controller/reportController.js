const Task = require("../models/task");
const User = require("../models/user");
const excelJS = require("exceljs");

//@desc export all tasks as an excel file
//@route GET /api/reports/export/tasks
//@access Private/Admin
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    // Define columns
    worksheet.columns = [
      { header: "task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 25 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
      { header: "Due Date", key: "dueDate", width: 20 },
    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        .map((user) => `${user.name} (${user.email})`)
        .join(", ");
      worksheet.addRow({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignedTo: assignedTo,
        dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
        assignedTo: assignedTo || "Unassigned",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "tasks_report.xlsx"
    );

    return workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc export all users as an excel file
//@route GET /api/reports/export/users
//@access Private/Admin
const exportUsersReport = async (req, res) => {
  try {
    const users = (await User.find().select("name email_id")).length();
    const userTasks = await Task.find().populate("assignedTo", "name email_id");

    const userTaskMap = {};
    userTasks.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        completedTasks: 0,
        inprogressTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser._id].taskCount += 1;
            if (task.status === "pending") {
              userTaskMap[assignedUser._id].pendingTasks += 1;
            } else if (task.status === "completed") {
              userTaskMap[assignedUser._id].completedTasks += 1;
            } else if (task.status === "IN progress") {
              userTaskMap[assignedUser._id].inprogressTasks += 1;
            }
          }
        });
      }
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet(" user task Report");

    worksheet.columns = [
      { header: "User Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Total Assigned Task", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 15 },
      {
        header: "In progres task",
        key: "inprogressTasks",
        width: 20,
      },
      {
        header: "Completed Tasks",
        key: "completedTasks",
        width: 15,
      },
    ];

    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment;filename="users_task_report.xlsx"'
    );

    return workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { exportTasksReport, exportUsersReport };
