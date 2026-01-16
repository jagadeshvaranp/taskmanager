import React, { useState, useEffect } from "react";
import DashboardLayout from "../../component/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosintance";
import { API_PATHS } from "../../utils/Apipaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../component/input/SelectDropdown";
import SelectUser from "../../component/input/SelectUser";
import TodoListInput from "../../component/input/TodoListInput";
import AddAttachmentInput from "../../component/input/AddAttachmentInput";

function Createtask() {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  // FIXED: Changed setcurrentTask to setCurrentTask to match usage
  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handlevalueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  // --- API ACTIONS ---

  // 1. Create Task
  const createTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Created Successfully");
      clearData();
      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error("Error creating task", error);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  // 2. Update Task
  const updateTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        // Note: This resets 'completed' to false on edit. 
        // If you need to persist status, you need to map currentTask.todoChecklist logic here.
        completed: false, 
      }));

      // Assuming your API path for update is TASKS.UPDATE_TASK(taskId) or similar
      // If not, replace with `API_PATHS.TASKS.CREATE_TASK + "/" + taskId`
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), { 
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Updated Successfully");
      navigate(-1); // Go back after update
    } catch (error) {
      console.error("Error updating task", error);
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Task
  const deleteTask = async () => {
    // Optional: Add a standard confirm if you don't have a custom modal ready
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    setLoading(true);
    try {
      // Assuming your API path for delete is TASKS.DELETE_TASK(taskId)
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success("Task Deleted Successfully");
      navigate(-1); // Go back after delete
    } catch (error) {
      console.error("Error deleting task", error);
      toast.error("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  // 4. Get Task Details
  const getTaskDetailsByID = async (id) => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));

      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo); // FIXED: Variable name matches state setter

        setTaskData((prevState) => ({
          ...prevState,
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          // Assuming backend returns objects, we map to strings for the input
          todoChecklist: taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to load task details");
    }
  };

  // Handle Form Submit
  const handleSubmit = async () => {
    setError(null);
    
    // Validation
    if (!taskData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (!taskData.dueDate) {
      setError("Due date is required");
      return;
    }
    if (taskData.assignedTo?.length === 0) {
      setError("Task not assigned to any member");
      return;
    }
    // Optional: Check if at least one todo item exists
    if (taskData.todoChecklist?.length === 0) {
      setError("Add at least one todo list item");
      return;
    }

    if (taskId) {
      await updateTask();
    } else {
      await createTask();
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID(taskId);
    }
  }, [taskId]); // FIXED: Dependency only needs taskId

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={deleteTask} 
                >
                  <LuTrash2 className="text-base" />
                  Delete
                </button>
              )}
            </div>
            
            {/* Title Input */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>
              <input
                placeholder="Create app UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handlevalueChange("title", target.value)
                }
              />
            </div>

            {/* Description Input */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                placeholder="Describe task"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ target }) => {
                  handlevalueChange("description", target.value);
                }}
              />
            </div>

            {/* Grid for Priority, Date, Assignee */}
            <div className="grid grid-cols-12 gap-4 mt-3">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handlevalueChange("priority", value)}
                  placeholder="Select priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  className="form-input"
                  value={taskData.dueDate || ""}
                  onChange={({ target }) =>
                    handlevalueChange("dueDate", target.value)
                  }
                  type="date"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600 ">
                  Assign To
                </label>
                <SelectUser
                  selectedUsers={taskData.assignedTo || []}
                  setSelectedUsers={(value) => {
                    handlevalueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>

            {/* Todo List */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                ToDo Checklist
              </label>
              <TodoListInput
                todoList={taskData?.todoChecklist || []}
                setTodoList={(value) =>
                  handlevalueChange("todoChecklist", value)
                }
              />
            </div>

            {/* Attachments */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachment
              </label>
              <AddAttachmentInput
                attachments={taskData?.attachments || []}
                setAttachment={(value) =>
                  handlevalueChange("attachments", value)
                }
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            {/* Submit Button */}
            <div className="flex justify-end mt-7">
              <button 
                className="add-btn" 
                onClick={handleSubmit} 
                disabled={loading}
              >
                {loading ? "PROCESSING..." : (taskId ? "UPDATE TASK" : "CREATE TASK")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Createtask;