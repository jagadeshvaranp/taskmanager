import React, { useEffect, useState } from "react";
import DashboardLayout from "../../component/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosintance";
import { API_PATHS } from "../../utils/Apipaths";
// import { LuFileSpreadsheet } from "react-icons/lu"; // Unused import
import TaskStatusTabs from "../../component/layouts/TaskStatusTabs";
import TaskCard from "../../component/cards/TaskCard";
import toast from "react-hot-toast";

function Mytask() {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false); // Added loading state

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // --- CORRECTION HERE ---
  const handleClick = (taskId) => {
    // Removed the extra double quote inside the backticks and fixed syntax
    navigate(`/user/task-detail/${taskId}`);
  };

  useEffect(() => {
    getAllTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="">
      <div className="my-5">
        
        {/* Header Section: Title & Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl md:text-2xl font-medium">My Tasks</h1>
        </div>

        {/* Tabs Section */}
        {/* Changed logic: Display tabs even if count is 0, so user can see 'All (0)' */}
        {tabs.length > 0 && (
           <div className="mb-6">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
           </div>
        )}

        {/* Task Grid */}
        {loading ? (
          <div className="text-center py-10">Loading tasks...</div>
        ) : allTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTasks.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo || []} 
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item._id)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-10 text-gray-500">
            <p>No tasks found for "{filterStatus}".</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Mytask;