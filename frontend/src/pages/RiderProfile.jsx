import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiderContext } from "../context/RiderContext";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";

const RiderProfile = () => {
  const navigate = useNavigate();
  const { createRider, loading, error } = useContext(RiderContext);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      toast.error("Please complete registration first");
      navigate("/login");
    }
    setUserId(storedUserId);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const formData = new FormData(e.target);
    formData.append("_id", userId);

    try {
      await createRider(formData);
      toast.success("Rider profile created successfully!");
      localStorage.removeItem("userId");
      navigate("/home");
    } catch (err) {
      toast.error(error || "Failed to create rider profile");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-yellow-500 shadow-lg rounded-lg p-8 w-full max-w-md relative">
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Profile Image
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 bg-white">
              <Camera className="w-5 h-5 text-gray-500" />
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                className="w-full bg-transparent border-none focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="+1234567890"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter your full address"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-yellow-500 hover:bg-gray-800"
              }`}
          >
            {loading ? "Creating Profile..." : "Complete Registration"}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-2 text-center bg-red-100 py-2 rounded-lg">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default RiderProfile;
