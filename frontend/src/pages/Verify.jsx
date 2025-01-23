import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import ReCAPTCHA from "react-google-recaptcha";

const Verify = () => {
  const [otp, setOtp] = useState(""); // State to store OTP
  const { btnLoading, verifyOtp } = UserData();
  const [show, setShow] = useState(false); // State to control button visibility
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert OTP to number and call verifyUser with OTP and navigation
      await verifyOtp(Number(otp), navigate);
      console.log("OTP submitted:", otp);
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  // Handle reCAPTCHA change
  const onChange = (value) => {
    console.log("Captcha value:", value);
    setShow(true); // Show the verify button when reCAPTCHA is completed
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Verify Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* reCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={onChange}
            />
          </div>

          {/* Verify Button */}
          {show && (
            <button
              type="submit"
              disabled={btnLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                btnLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {btnLoading ? "Verifying..." : "Verify"}
            </button>
          )}
        </form>

        {/* Resend OTP Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive an OTP?{" "}
            <Link to="/verify" className="text-blue-600 hover:text-blue-500">
              Resend OTP
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
