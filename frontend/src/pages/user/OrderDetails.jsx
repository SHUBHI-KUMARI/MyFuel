import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/client";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: "pending", label: "Pending" },
    { key: "assigned", label: "Accepted" },
    { key: "in-transit", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
  ];

  const getStepIndex = (status) => {
    return steps.findIndex((s) => s.key === status);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 text-lg">Loading tracking details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
        <Link to="/order-history" className="text-blue-600 hover:underline">
          &larr; Back to Orders
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const currentStep = getStepIndex(order.status);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to="/order-history"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          &larr; Back to Order History
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Order Tracking
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Order #{order._id.substring(0, 8)}
            </p>
          </div>
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${isCancelled ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}
          >
            {order.status}
          </span>
        </div>

        <div className="px-4 py-8 sm:px-6">
          {isCancelled ? (
            <div className="bg-red-50 p-6 rounded-lg text-center border border-red-200">
              <h4 className="text-lg font-bold text-red-700 mb-2">
                Order Cancelled
              </h4>
              <p className="text-sm text-red-600">
                This order has been cancelled and will not be delivered.
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="overflow-hidden">
                <div className="relative mb-8 pb-8">
                  {/* Progress Bar Line */}
                  <div className="absolute top-5 left-1/2 -ml-[45%] w-[90%] h-1 bg-gray-200 hidden sm:block"></div>

                  <div
                    className="absolute top-5 left-1/2 -ml-[45%] h-1 bg-blue-600 transition-all duration-500 ease-in-out hidden sm:block"
                    style={{
                      width: `${currentStep === 0 ? 0 : currentStep === 1 ? 30 : currentStep === 2 ? 60 : 90}%`,
                    }}
                  ></div>

                  <ul className="relative flex flex-col sm:flex-row justify-between sm:space-x-4 max-w-3xl mx-auto space-y-8 sm:space-y-0">
                    {steps.map((step, index) => {
                      const isCompleted = index <= currentStep;
                      const isCurrent = index === currentStep;

                      return (
                        <li
                          key={step.key}
                          className="relative flex items-center sm:flex-col group"
                        >
                          {/* Mobile vertical line */}
                          {index !== steps.length - 1 && (
                            <div
                              className={`absolute top-10 left-5 h-full w-0.5 sm:hidden ${index < currentStep ? "bg-blue-600" : "bg-gray-200"}`}
                            ></div>
                          )}

                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full z-10 
                              ${isCompleted ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-400"}
                              ${isCurrent ? "ring-4 ring-blue-100" : ""}
                              transition-all duration-300 mx-0 sm:mx-auto`}
                          >
                            {isCompleted ? (
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <span className="text-sm font-medium">
                                {index + 1}
                              </span>
                            )}
                          </div>
                          <div className="ml-4 sm:ml-0 sm:mt-4 text-left sm:text-center">
                            <p
                              className={`text-sm font-semibold uppercase tracking-wide ${isCompleted ? "text-blue-600" : "text-gray-500"}`}
                            >
                              {step.label}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-4 py-5 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Fuel Details</h4>
            <p className="mt-1 text-sm text-gray-900 capitalize font-medium">
              {order.fuelType}
            </p>
            <p className="text-sm text-gray-600">{order.quantity} Liters</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">
              Delivery Location
            </h4>
            <p className="mt-1 text-sm text-gray-900">
              {order.deliveryLocation}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Order Date</h4>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          {order.preferredDeliveryTime && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Preferred Delivery Info
              </h4>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(order.preferredDeliveryTime).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
