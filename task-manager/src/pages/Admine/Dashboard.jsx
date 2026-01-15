import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { LuArrowRight } from "react-icons/lu";

import axiosInstance from "../../utils/axiosintance";
import { API_PATHS } from "../../utils/Apipaths";
import { addThousandsSeparator } from "../../utils/helper";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";

// Components
import CustomPieChart from "../../component/charts/CustomPieChart";
import CustomBarChart from "../../component/charts/CustomBarChart";
import DashboardLayout from "../../component/layouts/DashboardLayout";
import InfoCard from "../../component/cards/InfoCard";
import TaskListTable from "../../component/TaskListTable";

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

function Dashboard() {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // Prepare Chart Data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      {
        status: "Pending",
        count: taskDistribution?.Pending || 0,
      },
      {
        status: "In Progress",
        count: taskDistribution?.InProgress || 0,
      },
      {
        status: "Completed",
        count: taskDistribution?.Completed || 0,
      },
    ];

    setPieChartData(taskDistributionData);

    const priorityLevelData = [
      {
        priority: "Low",
        count: taskPriorityLevels?.Low || 0,
      },
      {
        priority: "Medium",
        count: taskPriorityLevels?.Medium || 0,
      },
      {
        priority: "High",
        count: taskPriorityLevels?.High || 0,
      },
    ];

    setBarChartData(priorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
        console.log("dashboard loaded", response.data);
      }
    } catch (error) {
      console.error("error fetching dashboard data", error);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();
    return () => {};
  }, []);

  return (
    <div>
      <DashboardLayout activeMenu="Dashboard">
        <div className="my-5">
          {/* Header Section */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold">
              Good morning, {user?.name}
            </h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-5">
            <InfoCard
              label="Total Tasks"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.All || 0
              )}
              color="bg-primary"
            />
            <InfoCard
              label="Pending Tasks"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.Pending || 0
              )}
              color="bg-violet-500"
            />
            <InfoCard
              label="In Progress"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.InProgress || 0
              )}
              color="bg-cyan-500"
            />
            <InfoCard
              label="Completed Tasks"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.Completed || 0
              )}
              color="bg-lime-500"
            />
          </div>

          {/* --- CHARTS SECTION (Split 50/50 on Large Screens) --- */}
          {/* grid-cols-1 means stacked on mobile. lg:grid-cols-2 means side-by-side on large screens. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            
            {/* Pie Chart Card */}
            <div className="card h-full"> {/* h-full ensures both cards are same height */}
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-lg">Task Distribution</h5>
              </div>
              <div className="mt-4">
                <CustomPieChart data={pieChartData} colors={COLORS} />
              </div>
            </div>

            {/* Bar Chart Card */}
            <div className="card h-full">
              <div className="flex items-center justify-between">
                <h5 className="font-medium">Task Priority Levels</h5>
              </div>
              <CustomBarChart data={barChartData} />
            </div>
            
          </div>

          {/* --- RECENT TASKS SECTION (Full Width Below Charts) --- */}
          <div className="card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold">Recent Tasks</h5>
              <button
                className="flex items-center gap-3 text-[12px] font-medium text-gray-700 hover:text-primary bg-gray-50 hover:bg-blue-50 py-2 px-3 rounded-lg border border-gray-200/50 cursor-pointer transition-all"
                onClick={onSeeMore}
              >
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>

        </div>
      </DashboardLayout>
    </div>
  );
}

export default Dashboard;