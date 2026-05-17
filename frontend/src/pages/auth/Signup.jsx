import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import { useAuth } from "../../store/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const payload = { name, email, password };
      if (showAdminCode && adminCode) {
        payload.adminCode = adminCode;
      }
      const response = await client.post(ENDPOINTS.AUTH.SIGNUP, payload);
      const { user, token } = response.data;
      login(user, token);

      if (user.role === "admin") {
        navigate("/admin/orders", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          "Failed to sign up. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
        <p className="text-sm text-gray-600 mt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="name"
          >
            Full name
          </label>
          <div className="mt-1">
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Asha Patel"
            />
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="email"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="admin-toggle"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={showAdminCode}
            onChange={(e) => setShowAdminCode(e.target.checked)}
          />
          <label
            htmlFor="admin-toggle"
            className="ml-2 block text-sm text-gray-900"
          >
            Register as Admin
          </label>
        </div>

        {showAdminCode && (
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="adminCode"
            >
              Admin Secret Code
            </label>
            <div className="mt-1">
              <input
                id="adminCode"
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter secret code to get admin privileges"
              />
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}
