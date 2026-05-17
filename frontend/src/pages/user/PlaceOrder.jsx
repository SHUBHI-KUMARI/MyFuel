import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildDeliveryLocation = (data) =>
  [data.addressLine1, data.addressLine2, data.area, data.city, data.state]
    .map((part) => (part ? part.trim() : ""))
    .filter(Boolean)
    .join(", ");

export default function PlaceOrder() {
  const [formData, setFormData] = useState({
    fuelType: "petrol",
    quantity: "",
    addressLine1: "",
    addressLine2: "",
    area: "",
    city: "",
    state: "",
    preferredDeliveryDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const minDeliveryDate = formatDate(addDays(new Date(), 2));

  const isAddressValid =
    formData.addressLine1.trim().length >= 3 &&
    formData.area.trim().length >= 2 &&
    formData.city.trim().length >= 2 &&
    formData.state.trim().length >= 2;

  const quantityValue = Number(formData.quantity || 0);
  const isQuantityValid = !Number.isNaN(quantityValue) && quantityValue > 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openDatePicker = (event) => {
    if (event?.target?.showPicker) {
      event.target.showPicker();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!isQuantityValid) {
      setError("Quantity must be at least 1 liter.");
      setLoading(false);
      return;
    }

    if (!isAddressValid) {
      setError("Please provide a complete delivery address.");
      setLoading(false);
      return;
    }

    const minDate = addDays(new Date(), 2);
    minDate.setHours(0, 0, 0, 0);

    try {
      const payload = {
        fuelType: formData.fuelType,
        quantity: quantityValue,
        deliveryLocation: buildDeliveryLocation(formData),
      };

      if (formData.preferredDeliveryDate) {
        const selectedDate = new Date(
          `${formData.preferredDeliveryDate}T00:00:00`,
        );
        if (selectedDate < minDate) {
          setError("Preferred delivery date must be at least 2 days from today.");
          setLoading(false);
          return;
        }
        payload.preferredDeliveryTime = new Date(
          `${formData.preferredDeliveryDate}T12:00:00`,
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

  const formReady = isQuantityValid && isAddressValid;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate tracking-tight">
            Place Fuel Order
          </h2>
          <p className="mt-1 text-gray-500">Fill in the details below to request a fuel delivery.</p>
        </div>
      </div>

      <div className="card">
        <div className="px-6 py-8 sm:p-10">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700 font-medium">
                    Order placed successfully! Redirecting to your history...
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="petrol">Petrol (₹100/L)</option>
                  <option value="diesel">Diesel (₹90/L)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (Liters)
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  max="5000"
                  placeholder="e.g., 50"
                  className="input-field"
                  required
                />
              </div>

              <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Information</h3>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address line 1
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  placeholder="House number, building, street"
                  className="input-field"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address line 2
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, landmark (optional)"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="Neighborhood"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="input-field"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="input-field"
                  required
                />
              </div>

              <div className="sm:col-span-2 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Preferred Delivery Date{" "}
                    <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    2-day lead time
                  </span>
                </div>
                <div className="relative mt-1">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </span>
                  <input
                    type="date"
                    name="preferredDeliveryDate"
                    value={formData.preferredDeliveryDate}
                    onChange={handleInputChange}
                    onClick={openDatePicker}
                    onFocus={openDatePicker}
                    min={minDeliveryDate}
                    className="input-field pl-10 pt-2 pb-2"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>Earliest delivery: {minDeliveryDate}</span>
                  <span>Weekends available</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-5 rounded-lg border border-gray-100">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                Order Summary
              </h3>
              <div className="text-sm text-gray-500">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span>Estimated Cost:</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
                <p className="mt-3 text-xs text-gray-400 text-center">
                  Final price may vary slightly based on exact dispensed
                  quantity.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading || !formReady}
                className="btn-primary"
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
