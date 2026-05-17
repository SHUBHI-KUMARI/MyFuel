import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function PlaceOrder() {
  const [formData, setFormData] = useState({
    fuelType: "petrol",
    quantity: "",
    deliveryLocation: "",
    preferredDeliveryTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Form Validation matches backend Zod schema
    if (!formData.deliveryLocation || formData.deliveryLocation.length < 3) {
      setError("Delivery location must be at least 3 characters long.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        fuelType: formData.fuelType,
        quantity: Number(formData.quantity),
        deliveryLocation: formData.deliveryLocation,
      };

      if (formData.preferredDeliveryTime) {
        payload.preferredDeliveryTime = new Date(
          formData.preferredDeliveryTime,
        ).toISOString();
      }

      await api.post("/orders", payload);
      setSuccess(true);
      setTimeout(() => navigate("/order-history"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const pricing = { petrol: 100, diesel: 90 };
  const total = (
    Number(formData.quantity || 0) * pricing[formData.fuelType]
  ).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Place Fuel Order
          </h2>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Order placed successfully! Redirecting to your history...
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fuel Type
                </label>
                <div className="mt-1">
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    required
                  >
                    <option value="petrol">Petrol (₹100/L)</option>
                    <option value="diesel">Diesel (₹90/L)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity (Liters)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    max="5000"
                    placeholder="e.g., 50"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Location
                </label>
                <div className="mt-1">
                  <textarea
                    name="deliveryLocation"
                    value={formData.deliveryLocation}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter complete address..."
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Preferred Delivery Time{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="mt-1">
                  <input
                    type="datetime-local"
                    name="preferredDeliveryTime"
                    value={formData.preferredDeliveryTime}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-md">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order Summary
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Estimated Cost:{" "}
                  <span className="text-lg font-bold text-blue-600">
                    ₹{total}
                  </span>
                </p>
                <p className="mt-1 text-xs">
                  Final price may vary slightly based on exact dispensed
                  quantity.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={
                  loading || !formData.quantity || !formData.deliveryLocation
                }
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? "Processing..." : "Confirm & Place Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
