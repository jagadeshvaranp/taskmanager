import React from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../component/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../../utils/axiosintance";
import { API_PATHS } from "../../utils/Apipaths";
import { useEffect } from "react";
import moment from "moment";
 
function Dashboard() {
  useUserAuth();
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [dasboardData, setdashboardData] = useState(null);
  const [pieChartData, setpieChartData] = useState([]);
  const [barChatData, setbarChatData] = useState([]);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setdashboardData(response.data);
        console.log("dashboard loaded", response.data);
      }
    } catch (error) {
      console.error("error featching user", error);
    }
  };

  useEffect(() => {
      getDashboardData();
     return ()=>{}
  }, []);

  return (
    <div>
      <DashboardLayout activeMenu="Dashboard">
        <div className=" card my-5">
          <div>
            <div className="col-span-3">
                <h2 className="text-xl md:text-2xl">Good morning {user?.name}</h2>
                <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">{moment().format("dddd Do MMM YYYY")}</p>
            </div>
            
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}

export default Dashboard;
