import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { useAuth } from '../../store/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await client.get(ENDPOINTS.ORDERS.BASE);
        setOrders(response.data.orders || []);
      } catch (err) {
        setError('Failed to load recent orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const normalizeStatus = (status) =>
    String(status || "").trim().toLowerCase().replace(/\s+/g, "-");

  const formatStatusLabel = (status) => {
    const normalized = normalizeStatus(status);
    if (!normalized) return "";

    return normalized
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => normalizeStatus(o.status) === "pending").length;
  const deliveredOrders = orders.filter(o => normalizeStatus(o.status) === "delivered").length;

  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status) => {
    switch (normalizeStatus(status)) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "out-for-delivery":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name}! 👋</h2>
            <p className="text-blue-100 mt-2 text-lg">Here is an overview of your fuel orders.</p>
          </div>
          <div className="mt-6 md:mt-0 flex space-x-4">
            <Link
              to="/place-order"
              className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
            >
              Place New Order
            </Link>
            <Link
              to="/order-history"
              className="px-6 py-3 bg-blue-500 bg-opacity-30 text-white border border-blue-400 font-semibold rounded-lg shadow-sm hover:bg-opacity-40 transition-colors"
            >
              View History
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-blue-50 text-blue-600 relative overflow-hidden">
            <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Orders</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{loading ? '-' : totalOrders}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-yellow-50 text-yellow-600 relative overflow-hidden">
            <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pending</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{loading ? '-' : pendingOrders}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-green-50 text-green-600 relative overflow-hidden">
            <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Delivered</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{loading ? '-' : deliveredOrders}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
          <Link to="/order-history" className="text-sm text-blue-600 hover:text-blue-800 font-semibold group flex items-center gap-1">
            View all
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading orders...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              <p className="text-lg font-medium text-gray-900">No orders found</p>
              <p className="mt-1">You haven't placed any orders yet.</p>
              <Link to="/place-order" className="mt-4 inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
                Place your first order
                <span aria-hidden="true" className="ml-1">&rarr;</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fuel Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                        {order.fuelType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {order.quantity} L
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {formatStatusLabel(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
