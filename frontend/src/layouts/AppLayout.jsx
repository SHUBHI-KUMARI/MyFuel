import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function AppLayout() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading app...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">MyFuel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              {user.name} ({user.role})
            </span>
            <button
              onClick={logout}
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
