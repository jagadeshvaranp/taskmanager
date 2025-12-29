const task = require("../models/task");
const Task=require("../models/task")

//@decs get all ask (Admin :all,User:only assigned tasks)
//route get/api/tasks/
//@access orivate
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) filter.status = status;

    let tasks;

    // Admin → all tasks
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }
    // User → only assigned tasks
    else {
      tasks = await Task.find({
        ...filter,
        assignedTo: req.user._id,
      });
    }

    // Add completed todo count
    const updatedTasks = tasks.map((task) => {
      const completedTodoCount = task.todoChecklist.filter(
        (item) => item.completed
      ).length;

      return {
        ...task._doc,
        completedTodoCount,
      };
    });

    // Status summary
    const roleFilter =
      req.user.role === "admin" ? {} : { assignedTo: req.user._id };

    const allTasks = await Task.countDocuments(roleFilter);

    const pendingTasks = await Task.countDocuments({
      status: "pending",
      ...roleFilter,
    });

    const inProgressTasks = await Task.countDocuments({
      status: "In progress",
      ...roleFilter,
    });

    const completedTasks = await Task.countDocuments({
      status: "Completed",
      ...roleFilter,
    });

    res.json({
      tasks: updatedTasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc get task by id
//@route get/api/tasks/:id
//access private
const getTaskById=async(req,res)=>{
    try{
          const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileimageurl"
          )
          if (!task) return res.status(404).json({message:"task not found"})
            res.json(task)
    }catch(error){
    res.status(500).json({message:"server error",error:error.message})
    }

}

//@desc create the task (admin only)
//@route post/api/task/
// private (admine)
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist
    } = req.body;

    // Check required fields
    if (!title || !description || !priority || !dueDate || !assignedTo) {
      return res.status(400).json({
        message: "Please provide all required fields: title, description, priority, dueDate, assignedTo"
      });
    }

    // Check assignedTo is an array
    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({
        message: "assignedTo must be an array of user IDs"
      });
    }

    // Make sure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized. User not found."
      });
    }

    // Create the task
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      todoChecklist: todoChecklist || [],
      attachments: attachments || [],
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



//desc update task details
//routs put/api/tasks/:id
//@access Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update fields if provided
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;

    // Update assigned users
    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res
          .status(400)
          .json({ message: "assignedTo must be an array of user IDs" });
      }
      task.assignedTo = req.body.assignedTo;
    }

    // Save updated task
    const updatedTask = await task.save();

    // Send response
    res.json({
      message: "Task updated successfully",
      updatedTask,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//desc delete a taske (admine only)
//@route Delete/api/task/:id/status
//@access private

const deleteTask=async(req,res)=>{
        try{

          const task = await Task.findById(req.params.id);
          if(!task) return res.status(404).json({message:"task not found"})
            await task.deleteOne()
            res.json({message:"task deleted successfully"})
    }catch(error){
    res.status(500).json({message:"server error",error:error.message})
    }
}

//desc updatetask a taske (admine only)
//@route put/api/task/:id/status
//@access private
const updateTaskStatus=async(req,res)=>{
        try{
          const task = await Task.findById(req.params.id);
          if(!task) return res.status(404).json({message:"task not found"})
          const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
          );
          if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
          }
          task.status = req.body.status || task.status;
          if(task.status==="Completed"){
            task.todoChecklist.forEach(item=>item.completed=true)
            task.progress=100;
          }
          await task.save()
          res.json({message:"task status updated successfully",task})
          
    }catch(error){
    res.status(500).json({message:"server error",error:error.message})
    }
}

//@desc update a checklist
//@router put/api/tasks/:id/todo
//private 

const updateTaskChecklist=async (req,res)=>{
    try{
      const {todoChecklist}=req.body
      const task = await Task.findById(req.params.id);
      if(!task) return res.status(404).json({message:"task not found"})

        if(!task.assignedTo.includes(req.user._id)&& req.user.role!=="admin"){
          return res
          .status(403)
          .json({message:"not authorized to update checklist"})
        }
        task.todoChecklist=todoChecklist

        //auto update progress based on checklist completion
        const completedCount=task.todoChecklist.filter(item=>item.completed).length
        const totalCount=task.todoChecklist.length
        task.progress=totalCount>0?Math.round((completedCount/totalCount)*100):0

        //auto-mark task as completed if all iteames are checked
        if(task.progress===100){
          task.status="Completed";

        }else if(task.progress>0){
          task.status="In progress"
        }else{
          task.status="Pending"
        }
        await task.save()
        const updatedTask=await Task.findById(req.params.id).populate(
          "assignedTo",
          "name email profileImageUrl"
        )
        res.json({message:"task checklist updated successfully",task:updatedTask})
    }catch(error){
    res.status(500).json({message:"server error",error:error.message})
    }

}

//@desc dashboard data (admin only)
//route get /api/tasks/dashboard-data
//access prive
const getDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const overdueTasks = await Task.countDocuments({ status: { $ne: "Completed" }, dueDate: { $lt: new Date() } });

    const statusList = ["Pending", "In progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

    const taskDistribution = statusList.reduce((acc, status) => {
      acc[status] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
      return acc;
    }, {});

    const priorityList = ["Low", "Medium", "High"];
    // FIX: Use a DIFFERENT name for the raw data (priorityRaw) than the final object (taskPriorityLevels)
    const priorityRaw = await Task.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]);

    const taskPriorityLevels = priorityList.reduce((acc, priority) => {
      // FIX: Reference 'priorityRaw' here, NOT 'taskPriorityLevels'
      acc[priority] = priorityRaw.find(item => item._id === priority)?.count || 0;
      return acc;
    }, {});

    res.status(200).json({
      statistics: { totalTasks, pendingTasks, completedTasks, overdueTasks },
      charts: { taskDistribution, taskPriorityLevels },
      recentTasks: await Task.find().sort({ createdAt: -1 }).limit(10)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@desc dashboard data (user-specific)
//@route get/api/taske/user-dashboard-data
//@access private
const getUserDashboardData=async(req,res)=>{
    try{
      const userId=req.user._id

      //featch satatistics for user-specific
      const totalTasks=await Task.countDocuments({assignedTo:userId})
      const pendingTasks=await Task.countDocuments({assignedTo:userId,status:"Pending"})
      const completedTasks=await Task.countDocuments({assignedTo:userId,status:"Completed"})
      const overdueTasks=await Task.countDocuments({
        assignedTo:userId,
        status:{$ne:"Completed"},
        dueDate:{$lt:new Date()}
      })

      //task distribution by status
      const statusList=["Pending","In progress","Completed"]
      const taskDistributionRaw=await Task.aggregate([
        {
          $match:{assignedTo:userId}
        },
        {
          $group:{
            _id:"$status",
            count:{$sum:1}
          }
        }
      ])

      const taskDistribution= statusList.reduce((acc,status)=>{
        const formattedStatus=status.replace(/\s+/g," ");
        acc[formattedStatus]=taskDistributionRaw.find(item=>item._id===status)?.count || 0;
        return acc;
      },{})
      taskDistribution["All"]=totalTasks

      //task distribution by priority
      const priorityList=["Low","Medium","High"]
      const priorityDistributionRaw=await Task.aggregate([
        {
          $match:{assignedTo:userId}
        },
        {
          $group:{
            _id:"$priority",
            count:{$sum:1}
          }
        }
      ])
      const taskPriorityLevels= taskPriorities.reduce((acc,priority)=>{
        acc[priority]=
        taskPriorityLevelsRaw.find(item=>item._id===priority)?.count ||0;
        return acc;
      },{})

      //feacth recent  10tasks
      const recentTasks=await Task.find({assignedTo:userId})
      .sort({createdAt:-1})
      .limit(10)
      .select("title status priority createdAt")

      res.status(200).json({
        statistics:{
          totalTasks,
          pendingTasks,
          completedTasks,
          overdueTasks
        },
        charts:{
          taskDistribution,
          taskPriorityLevels,
        },
        recentTasks
      })
    }catch(error){
    res.status(500).json({message:"server error",error:error.message})
    }

}

module.exports={
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
}