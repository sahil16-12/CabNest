import React, { useState } from "react";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";

import { FaEnvelope, FaLock } from "react-icons/fa";
import { UserData } from "../context/UserContext";
const Login = () => {
  const { loginUser, btnLoading } = UserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(email, password, navigate);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      {/* Login Form Card */}
      <div className="relative z-10 max-w-md w-full bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-white mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-300 mb-8">
          Login to continue your journey with{" "}
          <span className="font-bold">CabNest</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email Address"
              className="w-full pl-10 px-4 py-3 rounded-md border border-gray-300 shadow-sm bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full pl-10 px-4 py-3 rounded-md border border-gray-300 shadow-sm bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={btnLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold tracking-wide shadow-lg transform transition-all duration-300 ${
              btnLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 hover:shadow-2xl"
            }`}
          >
            {btnLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:underline hover:text-blue-300"
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Forgot Password Link */}
        <div className="text-center mt-4">
          <Link
            to="/forgot"
            className="text-sm text-blue-400 hover:underline hover:text-blue-300"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
