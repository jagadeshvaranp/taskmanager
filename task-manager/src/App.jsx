import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

import Dashboard from "./pages/Admine/Dashboard";
import Createtask from "./pages/Admine/CreateTask";
import ManagerTask from "./pages/admine/ManagerTask";
import MangerUser from "./pages/admine/MangerUser";

import MyTask from "./pages/User/Mytask";
import UserDashboard from "./pages/User/UserDashboard";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";

import PrivateRoute from "./routes/PrivateRoute";
import UserProvider, { UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <UserProvider>
      <BrowserRouter basename="/taskmanager">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/create-task" element={<Createtask />} />
            <Route path="/admin/tasks" element={<ManagerTask />} />
            <Route path="/admin/users" element={<MangerUser />} />
          </Route>

          {/* User Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={["member"]} />}>
            {/* CORRECTED: Changed "/user/mytask" to "/user/tasks" to match your error URL */}
            <Route path="/user/tasks" element={<MyTask />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/task-detail/:id" element={<ViewTaskDetails />} />
          </Route>

          {/* Default Route */}
          <Route path="/" element={<Root />} />
        </Routes>

        <Toaster
          toastOptions={{
            className: 'text-sm font-medium',
            style: {
              fontSize: "13px"
            },
          }}
        />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin"
    ? <Navigate to="/admin/dashboard" />
    : <Navigate to="/user/dashboard" />;
};