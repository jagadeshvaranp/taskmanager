import React, { useState, useEffect } from "react";
import DashboardLayout from "../../component/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosintance"; // CHECK: Ensure file name matches exactly
import { API_PATHS } from "../../utils/Apipaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../component/input/SelectDropdown";
import SelectUser from "../../component/input/SelectUser";
import TodoListInput from "../../component/input/TodoListInput";
import AddAttachmentInput from "../../component/input/AddAttachmentInput";

function CreateTask() {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [], // We need to store full objects here, not just strings, to save state
    attachments: [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // REMOVED: Unused state 'openDeleteAlert'

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  // --- API ACTIONS ---

  // 1. Create Task
  const createTask = async () => {
    setLoading(true);
    try {
      // Map strings to objects for the API
      const todolist = taskData.todoChecklist?.map((item) => {
        // Handle if item is already an object (from update) or a string (new input)
        if (typeof item === 'object') return item; 
        return { text: item, completed: false };
      });

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Created Successfully");
      navigate(-1);
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
      // FIX: preserve the 'completed' status if it exists
      const todolist = taskData.todoChecklist?.map((item) => {
        // If it's already an object (preserved from GET), keep it. 
        // If it's a new string added during edit, make it an object.
        if (typeof item === 'object') {
            return item; 
        }
        return { text: item, completed: false };
      });

      // CHECK: Ensure API_PATHS.TASKS.UPDATE_TASK is a function accepting ID, 
      // OR use string concatenation: `${API_PATHS.TASKS.UPDATE_TASK}/${taskId}`
      let url = API_PATHS.TASKS.UPDATE_TASK;
      if (typeof API_PATHS.TASKS.UPDATE_TASK === 'function') {
         url = API_PATHS.TASKS.UPDATE_TASK(taskId);
      } else {
         // Fallback if your Apipaths.js defines it as a string
         url = url + "/" + taskId; 
      }

      await axiosInstance.put(url, { 
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Updated Successfully");
      navigate(-1);
    } catch (error) {
      console.error("Error updating task", error);
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Task
  const deleteTask = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    setLoading(true);
    try {
      // Same check for URL generation
      let url = API_PATHS.TASKS.DELETE_TASK;
      if (typeof API_PATHS.TASKS.DELETE_TASK === 'function') {
         url = API_PATHS.TASKS.DELETE_TASK(taskId);
      } else {
         url = url + "/" + taskId; 
      }

      await axiosInstance.delete(url);
      toast.success("Task Deleted Successfully");
      navigate(-1);
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
      // Ensure URL handling matches your API_PATHS structure
      let url = API_PATHS.TASKS.GET_TASK_BY_ID;
      if (typeof url === 'function') url = url(id);
      else url = url + "/" + id;

      const response = await axiosInstance.get(url);

      if (response.data) {
        const taskInfo = response.data;

        setTaskData({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          // FIX: Don't map to text only! Keep the object to preserve 'completed' status
          // If your TodoListInput component ONLY accepts strings, you will need to refactor that component.
          // Assuming TodoListInput can handle objects or strings:
          todoChecklist: taskInfo?.todoChecklist || [], 
          attachments: taskInfo?.attachments || [],
        });
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to load task details");
    }
  };

  const handleSubmit = async () => {
    setError(null);
    
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
  }, [taskId]);

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
            
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>
              <input
                placeholder="Create app UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

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
                  handleValueChange("description", target.value);
                }}
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-3">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
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
                    handleValueChange("dueDate", target.value)
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
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                ToDo Checklist
              </label>
              <TodoListInput
                todoList={taskData?.todoChecklist || []}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachment
              </label>
              <AddAttachmentInput
                attachments={taskData?.attachments || []}
                setAttachment={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

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

export default CreateTask;