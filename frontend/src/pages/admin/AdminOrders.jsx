import React, { useState, useEffect } from "react";
import api from "../../api/client";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusOptions, setStatusOptions] = useState([
    "pending",
    "accepted",
    "out-for-delivery",
    "delivered",
  ]);

  // Filters and Pagination
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1, total: 0 });

  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);
      params.append("page", page);
      params.append("limit", 10);

      const { data } = await api.get(`/admin/orders?${params.toString()}`);
      setOrders(data.orders);
      setMeta(data.meta || { totalPages: 1, total: data.orders.length });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  useEffect(() => {
    let isMounted = true;

    const fetchStatuses = async () => {
      try {
        const { data } = await api.get("/admin/orders/statuses");
        if (isMounted && Array.isArray(data.statuses) && data.statuses.length) {
          setStatusOptions(data.statuses);
        }
      } catch (err) {
        // Keep default status list if the request fails.
      }
    };

    fetchStatuses();

    return () => {
      isMounted = false;
    };
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchOrders();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(
        orders.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

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

  const getStatusColor = (status) => {
    const statusKey = normalizeStatus(status);

    switch (statusKey) {
      case "pending":
        return "text-yellow-800 bg-yellow-100";
      case "accepted":
        return "text-blue-800 bg-blue-100";
      case "out-for-delivery":
        return "text-indigo-800 bg-indigo-100";
      case "delivered":
        return "text-green-800 bg-green-100";
      default:
        return "text-gray-800 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Admin Dashboard
          </h2>
          <p className="mt-1 text-gray-500">Manage all customer fuel orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="card px-6 py-6 transition-shadow hover:shadow-md flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          </div>
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wider text-gray-500 truncate">
              Total Orders (Matching)
            </dt>
            <dd className="mt-1 text-3xl font-black text-gray-900">
              {meta.total}
            </dd>
          </div>
        </div>
      </div>

      <div className="card mb-8 p-5 bg-gray-50/50">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="input-field pl-10 bg-white"
              placeholder="Search by fuel or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-56">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="input-field bg-white"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {formatStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Order / Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading && orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const orderId = String(order._id || order.id || "");
                    const displayId = orderId.length > 10
                      ? `${orderId.slice(0, 6)}...${orderId.slice(-4)}`
                      : orderId;

                    return (
                      <tr
                        key={orderId}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="font-semibold text-gray-900" title={orderId}>
                            #{displayId}
                          </div>
                          <div className="text-gray-500 font-medium">
                            {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="font-medium text-gray-900">
                            {order.userId?.name || "Unknown"}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {order.userId?.email || ""}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="capitalize font-medium">{order.fuelType}</span>
                          <div className="text-gray-500">({order.quantity}L)</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {order.deliveryLocation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(order.status)}`}
                          >
                            {formatStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select
                            disabled={updatingId === orderId}
                            value={normalizeStatus(order.status)}
                            onChange={(e) =>
                              handleStatusChange(orderId, e.target.value)
                            }
                            className={`block w-full pl-3 pr-8 py-1.5 text-xs font-medium bg-gray-50 border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md border ${updatingId === orderId ? "opacity-50" : ""}`}
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {formatStatusLabel(status)}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="bg-gray-50/50 px-4 py-3 border-t border-gray-100 flex items-center justify-between sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{page}</span> of{" "}
                  <span className="font-medium">{meta.totalPages}</span>
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(meta.totalPages, p + 1))
                    }
                    disabled={page === meta.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
