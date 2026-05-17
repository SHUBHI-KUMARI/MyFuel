import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../store/AuthContext";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

// Stubs for now
const Dashboard = () => (
  <div className="p-4 text-center">Dashboard Page Stub</div>
);
const AdminOrders = () => (
  <div className="p-4 text-center">Admin Orders Page Stub</div>
);

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/orders" : "/dashboard"}
        replace
      />
    );
  }
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
