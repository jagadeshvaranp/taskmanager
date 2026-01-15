import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { UserContext } from '../context/userContext'; // Make sure this path is correct

function PrivateRoute({ allowedRoles }) {
  const { user, loading } = useContext(UserContext);

  // 1. Optional: Show a loading spinner while checking if user is logged in
  if (loading) {
    return <div>Loading...</div>; 
  }

  // 2. Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Check if user has the correct role (e.g., "admin")
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is logged in but not an admin, send them to a "Not Authorized" page or Home
    return <Navigate to="/unauthorized" replace />; 
  }

  
  return <Outlet />;
}

export default PrivateRoute;