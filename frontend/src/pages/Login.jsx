import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserData } from "../context/UserContext";
import { FaGoogle, FaFacebook, FaGithub, FaCar } from "react-icons/fa";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "../index.css";

const Login = () => {
  const { loginUser, btnLoading } = UserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const currentLocation = [
          position.coords.longitude,
          position.coords.latitude,
        ];

        await loginUser(email, password, currentLocation, navigate);
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Unable to retrieve location. Please enable location services.");
      }
    );
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-space-900 via-space-800 to-space-700 relative overflow-hidden">
      {/* Animated Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          particles: {
            number: { value: 50 },
            color: { value: "#ffffff" },
            opacity: { value: 0.5 },
            size: { value: 1 },
            move: {
              enable: true,
              speed: 1.5,
              direction: "none",
              random: true,
              straight: false,
            },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* Floating Car Animation */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute left-10 top-1/3 opacity-20"
      >
        <FaCar className="text-6xl text-white rotate-45" />
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-2xl border border-opacity-30 border-gray-200 p-12 mx-4"
      >
        <div className="flex items-center justify-center mb-8">
          <FaCar className="text-4xl text-blue-500 mr-3" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            CabNest
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Animated Input Fields */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 bg-white rounded-xl border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder=" "
            />
            <label className="absolute left-6 top-2 text-sm text-gray-700 pointer-events-none transition-all duration-300 ease-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-base">
              Email Address
            </label>
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-6 py-4 bg-white rounded-xl border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder=" "
            />
            <label className="absolute left-6 top-2 text-sm text-gray-700 pointer-events-none transition-all duration-300 ease-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-base">
              Password
            </label>
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-5 h-5 accent-blue-500 rounded border-2 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-gray-700">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={btnLoading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg ${
              btnLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-xl"
            } text-white transition-all duration-300`}
          >
            {btnLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              "Login to Continue"
            )}
          </motion.button>

          {/* Social Login */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">
              Or continue with
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: FaGoogle, color: "bg-red-500" },
              { icon: FaFacebook, color: "bg-blue-600" },
              { icon: FaGithub, color: "bg-gray-700" },
            ].map(({ icon: Icon, color }, idx) => (
              <motion.button
                key={idx}
                whileHover={{ y: -2 }}
                className={`${color} p-4 rounded-xl text-white flex items-center justify-center hover:bg-opacity-90 transition-all`}
              >
                <Icon className="text-2xl" />
              </motion.button>
            ))}
          </div>

          {/* Registration Link */}
          <p className="text-center text-gray-600">
            New to CabNest?{" "}
            <Link
              to="/signup"
              className="text-blue-500 hover:text-blue-600 font-semibold"
            >
              Create Account
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
