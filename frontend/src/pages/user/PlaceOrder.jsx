import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function PlaceOrder() {
  const [formData, setFormData] = useState({
    fuelType: "petrol",
    quantity: "",
    deliveryAddress: "",
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
    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity)
      };
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
  const total = (Number(formData.quantity || 0) * pricing[formData.fuelType]).toFixed(2);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Place a New Order</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded mb-4">
            Order placed successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
              required
            >
              <option value="petrol">Petrol (₹100/L)</option>
              <option value="diesel">Diesel (₹90/L)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Liters)</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              max="1000"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <textarea
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleInputChange}
              rows="3"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
              required
            ></textarea>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
            <p className="text-gray-600 mt-1">Total Estimated Cost: <span className="font-bold text-blue-600">₹{total}</span></p>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.quantity || !formData.deliveryAddress}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Confirm Delivery"}
          </button>
        </form>
      </div>
    </div>
  );
}
