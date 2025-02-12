import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRider } from "../context/RiderContext";

const RiderProfile = () => {
  const navigate = useNavigate();
  const { fetchRiderProfile, updateRiderProfile } = useRider();
  const [profile, setProfile] = useState({
    profileImage: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
  });

  // Get user ID from local storage (assuming it's stored after signup)
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchRiderProfile(userId);
    }
  }, [userId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfile({ ...profile, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("profileImage", profile.profileImage);
      formData.append("dateOfBirth", profile.dateOfBirth);
      formData.append("phoneNumber", profile.phoneNumber);
      formData.append("address", profile.address);
      formData.append("user", userId);

      await updateRiderProfile(userId, formData);
      navigate("/home"); // Redirect to Home page after completing the profile
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Complete Your Rider Profile
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              required
              className="mt-1 w-full border px-3 py-2 rounded-md"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={profile.dateOfBirth}
              onChange={handleChange}
              required
              className="mt-1 w-full border px-3 py-2 rounded-md"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 w-full border px-3 py-2 rounded-md"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              required
              className="mt-1 w-full border px-3 py-2 rounded-md"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default RiderProfile;
