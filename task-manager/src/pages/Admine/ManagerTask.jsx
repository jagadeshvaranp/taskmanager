import React, { useEffect, useState } from "react";
import DashboardLayout from "../../component/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosintance";
import { API_PATHS } from "../../utils/Apipaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../component/layouts/TaskStatusTabs";
import TaskCard from "../../component/cards/TaskCard";
import toast from "react-hot-toast"; 

function ManagerTask() {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTasks(
        response.data?.tasks?.length > 0 ? response.data.tasks : []
      );

      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inprogressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    }
  };

  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  // Download Task Report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `task_details_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Task report downloaded successfully");
    } catch (error) {
      console.error("Error downloading task report:", error);
      toast.error("Failed to download task report. Please try again.");
    }
  };

  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        
        {/* Header Section: Title & Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl md:text-2xl font-medium">Manage Tasks</h1>
          
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Download Button - Visible on all screens */}
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium" 
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        {tabs?.[0]?.count > 0 && (
           <div className="mb-6">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
           </div>
        )}

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTasks?.map((item) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              // FIX: Pass the full objects so AvatarGroup can show Initials if image is missing
              assignedTo={item.assignedTo || []} 
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoChecklist={item.todoChecklist || []}
              onClick={() => {
                handleClick(item);
              }}
            />
          ))}

          {/* Empty State */}
          {allTasks.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No tasks found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ManagerTask;