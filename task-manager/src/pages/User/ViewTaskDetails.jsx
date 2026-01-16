import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosintance";
import { API_PATHS } from "../../utils/Apipaths";
import DashboardLayout from "../../component/layouts/DashboardLayout";
import moment from "moment";
import { LuSquareArrowOutDownRight } from "react-icons/lu";

function ViewTaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  
  // State to track loading status of specific checklist items
  const [checklistLoading, setChecklistLoading] = useState({});

  // --- 1. Helper Functions ---

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-600 bg-cyan-50 border border-cyan-100";
      case "Completed":
        return "text-emerald-600 bg-emerald-50 border border-emerald-100";
      default:
        return "text-violet-600 bg-violet-50 border border-violet-100";
    }
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.log("error fetching task", error);
    }
  };

  // --- MAIN LOGIC: Toggle Checkbox & Update Status ---
  const handleCheckboxChange = async (index) => {
    if (!task?.todoChecklist || !task.todoChecklist[index]) return;

    const taskId = id;
    
    // 1. Set Loading State for this specific item
    setChecklistLoading((prev) => ({ ...prev, [index]: true }));

    // 2. Clone and Toggle
    const newChecklist = [...task.todoChecklist];
    const currentItem = newChecklist[index];

    // Handle JSON property: check 'completed' first, fallback to 'isCompleted'
    const isCurrentlyDone = currentItem.completed !== undefined 
      ? currentItem.completed 
      : currentItem.isCompleted;

    const newValue = !isCurrentlyDone;

    // Update the item (Update both keys to be safe)
    newChecklist[index] = {
      ...currentItem,
      completed: newValue,
      isCompleted: newValue 
    };

    // 3. Calculate New Status based on progress
    const totalItems = newChecklist.length;
    const completedCount = newChecklist.filter(
      (item) => item.completed || item.isCompleted
    ).length;

    let newStatus = "Pending"; // Default
    if (completedCount === totalItems && totalItems > 0) {
      newStatus = "Completed";    // All items done
    } else if (completedCount > 0) {
      newStatus = "In Progress";  // Some items done
    }

    // 4. Optimistic Update (Update UI immediately)
    setTask((prev) => ({ 
      ...prev, 
      todoChecklist: newChecklist,
      status: newStatus 
    }));

    try {
      // 5. API Call: Send Checkbox data AND the new Status
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
        { 
          todoChecklist: newChecklist,
          status: newStatus 
        }
      );

      // 6. Sync with server response
      if (response.status === 200 && response.data?.task) {
        setTask(response.data.task);
      }

    } catch (error) {
      console.error("Error updating checklist", error);
      // Optional: Revert UI here if needed
    } finally {
      // 7. Turn off loading
      setChecklistLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Helper to open links safely
  const handleLinkClick = (link) => {
    if (!link) return; 
    let urlToOpen = link;
    if (!/^https?:\/\//i.test(link)) {
      urlToOpen = "https://" + link; 
    }
    window.open(urlToOpen, "_blank");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --- 2. Main Render ---
  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="p-4 md:p-8">
        {task && (
          <div className="max-w-4xl mx-auto">
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
                    {task?.title}
                  </h2>
                  <div
                    className={`shrink-0 text-[13px] font-semibold px-4 py-1.5 rounded-full ${getStatusTagColor(
                      task?.status
                    )}`}
                  >
                    {task?.status}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 space-y-8">
                
                {/* Description */}
                <div>
                  <InfoBox
                    label="Description"
                    value={task?.description || "No description provided."}
                    isDescription={true}
                  />
                </div>

                {/* Checklist Section */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Checklist
                  </label>
                  {task?.todoChecklist && task.todoChecklist.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                      {task.todoChecklist.map((item, index) => (
                        <UpdateTodoChecklist
                          key={item._id || index}
                          text={item.title || item.text}
                          // Check both properties for compatibility
                          isChecked={item.completed || item.isCompleted}
                          isLoading={checklistLoading[index]} 
                          onChange={() => handleCheckboxChange(index)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No checklist items.
                    </p>
                  )}
                </div>

                {/* Attachments Section */}
                {task?.attachments?.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Attachments
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {task.attachments.map((link, index) => (
                        <Attachment
                          key={`link_${index}`}
                          link={link}
                          index={index}
                          onClick={() => handleLinkClick(link)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta Data Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="md:border-r border-gray-200 pr-0 md:pr-4">
                    <InfoBox label="Priority" value={task?.priority} />
                  </div>
                  <div className="md:border-r border-gray-200 pr-0 md:pr-4">
                    <InfoBox
                      label="Due Date"
                      value={
                        task?.dueDate
                          ? moment(task?.dueDate).format("Do MMM YYYY")
                          : "N/A"
                      }
                    />
                  </div>
                  
                  {/* Assigned To */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Assigned To
                    </label>
                    <div className="flex -space-x-2 overflow-hidden py-1">
                      {task?.assignedTo && task.assignedTo.length > 0 ? (
                        task.assignedTo.map((member, index) => (
                          <div
                            key={member._id || index}
                            title={member.fullName || member.name}
                            className="relative inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-indigo-100 text-indigo-600 text-xs font-bold uppercase ring-1 ring-gray-200"
                          >
                            {member.profileImageUrl ? (
                              <img
                                src={member.profileImageUrl}
                                alt="user"
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              // Initials Logic
                              <span>
                                {(member.fullName || member.name)
                                  ? (member.fullName || member.name).slice(0, 2).toUpperCase()
                                  : "?"}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 font-medium">
                          Unassigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ViewTaskDetails;

// --- 3. Sub Components ---

const InfoBox = ({ label, value, isDescription = false }) => {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <p
        className={`text-sm text-gray-800 font-medium ${
          isDescription
            ? "leading-relaxed whitespace-pre-wrap text-gray-700"
            : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
};

const UpdateTodoChecklist = ({ text, isChecked, onChange, isLoading }) => {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
      <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
        {isLoading ? (
          // Custom SVG Loader (No dependencies required)
          <svg
            className="animate-spin h-4 w-4 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={onChange}
            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
          />
        )}
      </div>

      <p
        className={`text-sm ${
          isChecked
            ? "text-gray-400 line-through"
            : "text-gray-700 font-medium"
        }`}
      >
        {text}
      </p>
    </div>
  );
};

const Attachment = ({ link, index, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 text-xs font-bold rounded-md group-hover:bg-white group-hover:text-indigo-600 transition-colors">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>
        <p className="text-sm text-gray-600 font-medium truncate max-w-[200px] md:max-w-[300px] group-hover:text-indigo-900">
          {link}
        </p>
      </div>
      <LuSquareArrowOutDownRight className="flex-shrink-0 w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
    </div>
  );
};