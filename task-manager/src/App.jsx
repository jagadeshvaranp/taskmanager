import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

import Dashboard from "./pages/admine/Dashboard";
import Createtask from "./pages/admine/Createtask";
import ManagerTask from "./pages/admine/ManagerTask";
import MangerUser from "./pages/admine/MangerUser";

import MyTask from "./pages/User/MyTask";
import UserDashboard from "./pages/User/UserDashboard";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";

import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/create-task" element={<Createtask />} />
          <Route path="/admin/manager-task" element={<ManagerTask />} />
          <Route path="/admin/manageruser" element={<MangerUser />} />
        </Route>

        {/* User Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/user/mytask" element={<MyTask />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/task-detail/:id" element={<ViewTaskDetails />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
