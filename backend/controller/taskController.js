const Task=require("../models/task")

//@decs get all ask (Admin :all,User:only assigned tasks)
//route get/api/tasks/
//@access orivate
const getTasks=async(req,res)=>{
    try{

    }catch(error){
    res.status(500).json({message:"server error",error:error.message})
    }
}

//@desc get task by id
//@route get/api/tasks/:id
//access private
const getTaskById=async(req,res)=>{
    try{

    }catch(error){
    res.status(500).json({message:"server error",error:error.message})
    }

}

//@desc create the task (admin only)
//@route post/api/task/
// private (admine)
const createTask=async(req,res)=>{
    try{
        const {
            title,
            description,
            priority,
            dueDate,
            AssignedTo,
            attachments,
            todoChecklist
        }=req.body

        if(!Array.isArray(AssignedTo)){
            return res.status(400)
            .json({message:"assignedto  must be  an arry of user Id"})
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy:req.user._id,
            todoChecklist,
            attachments,
        })

        res.status(200).json({message:"server error",error:error.message})
    }catch(error){
    res.status(500).json({message:"server error",error:error.message})
    }

}


//desc update task details
//routs put/api/tasks/:id
//@access Private

const updateTask=async(req,res)=>{
    try{

    }catch(error){
    res.status(500).json({message:"server error",error:error.message})
    }

}

//desc delete a taske (admine only)
//@route Delete/api/task/:id/status
//@access private

const deleteTask=async(req,res)=>{
        try{

    }catch(error){
    res.status(500).json({message:"server error",error:error.message})
    }
}

//desc updatetask a taske (admine only)
//@route put/api/task/:id/status
//@access private
const updateTaskStatus=async(req,res)=>{
        try{

    }catch(error){
    res.status(500).json({message:"server error",error:error.message})
    }
}

//@desc update a checklist
//@router put/api/tasks/:id/todo
//private 

const updateTaskChecklist=async (req,res)=>{
    try{

    }catch(error){
    res.status(500).json({message:"server error",error:error.message})
    }

}

//@desc dashboard data (admin only)
//route get /api/tasks/dashboard-data
//access prive
const getDashboardData=async(req,res)=>{
    try{

    }catch(error){
    res.status(500).json({message:"server error",error:error.message})
    }

}

//@desc dashboard data (user-specific)
//@route get/api/taske/user-dashboard-data
//@access private
const getUserDashboardData=async(req,res)=>{
    try{

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