import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserData } from "../context/UserContext";
import { FaCarSide, FaUser, FaShieldAlt } from "react-icons/fa";
import zxcvbn from "zxcvbn";
import "../index.css";

const Register = () => {
  const { RegisterUser, btnLoading } = UserData();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();

  const passwordStrength = zxcvbn(formData.password).score;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) return setStep(step + 1);
    const { name, email, password, role } = formData;
    const user = await RegisterUser(name, email, password, role, navigate);
    if (user) navigate(role === "rider" ? "/rider-profile" : "/home");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-space-900 via-space-800 to-space-700 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-2xl bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-2xl border border-opacity-30 border-gray-200 p-12 mx-4">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= num
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 border border-gray-300 text-gray-500"
                }`}
              >
                {num}
              </div>
              {num < 3 && <div className="w-12 h-1 bg-gray-300 mx-2"></div>}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="relative">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-white rounded-xl border-2 border-gray-200 text-gray-800 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all peer"
                  placeholder=" "
                />
                <label className="absolute left-6 top-2 text-sm text-gray-700 pointer-events-none transition-all duration-300 ease-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
                  Username
                </label>
                <FaUser className="absolute right-6 top-5 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-white rounded-xl border-2 border-gray-200 text-gray-800 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all peer"
                  placeholder=" "
                />
                <label className="absolute left-6 top-2 text-sm text-gray-700 pointer-events-none transition-all duration-300 ease-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
                  Email Address
                </label>
              </div>
            </motion.div>
          )}

          {/* Step 2: Role Selection */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                {
                  role: "rider",
                  title: "Rider",
                  icon: FaCarSide,
                  desc: "Book rides, track drivers, and manage trips",
                },
                {
                  role: "driver",
                  title: "Driver",
                  icon: FaShieldAlt,
                  desc: "Offer rides, manage bookings, and earn money",
                },
              ].map(({ role, title, icon: Icon, desc }) => (
                <motion.div
                  key={role}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setFormData({ ...formData, role })}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.role === role
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <Icon
                    className={`text-4xl mb-4 ${
                      formData.role === role ? "text-blue-500" : "text-gray-500"
                    }`}
                  />
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      formData.role === role ? "text-blue-500" : "text-gray-800"
                    }`}
                  >
                    {title}
                  </h3>
                  <p
                    className={`${
                      formData.role === role ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    {desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Step 3: Password & Terms */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-white rounded-xl border-2 border-gray-200 text-gray-800 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all peer"
                  placeholder=" "
                />
                <label className="absolute left-6 top-2 text-sm text-gray-700 pointer-events-none transition-all duration-300 ease-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
                  Create Password
                </label>

                {/* Password Strength Meter */}
                <div className="flex gap-1 mt-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 w-full rounded-full ${
                        passwordStrength > i
                          ? i < 2
                            ? "bg-red-400"
                            : i < 3
                            ? "bg-yellow-400"
                            : "bg-green-400"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  className="w-5 h-5 accent-blue-500 rounded border-2 border-gray-300 focus:ring-blue-500"
                />
                <label className="ml-3 text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-8 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={btnLoading}
              className={`ml-auto px-8 py-3 rounded-lg font-semibold ${
                btnLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-xl"
              } text-white transition-all`}
            >
              {step === 3 ? "Create Account" : "Continue"}
            </motion.button>
          </div>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
