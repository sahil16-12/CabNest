import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDriver } from "../context/DriverContext";
import { Camera } from "lucide-react";

const DriverProfile = () => {
  const navigate = useNavigate();
  const { createDriverProfile } = useDriver();
  const [profile, setProfile] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    profileImage: "",
    licenseNumber: "",
    address: "",
  });

  const userId = localStorage.getItem("userId");

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
      if (profile.profileImage instanceof File) {
        formData.append("profileImage", profile.profileImage);
      }
      // Append other fields
      formData.append("fullName", profile.fullName);
      formData.append("phoneNumber", profile.phoneNumber);
      formData.append("dateOfBirth", profile.dateOfBirth);
      formData.append("licenseNumber", profile.licenseNumber);
      formData.append("address", profile.address);
      formData.append("_id", userId);

      await createDriverProfile(formData);
      navigate("/home");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please check the provided information.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-lg w-full bg-yellow-500 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Complete Your Driver Profile
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Profile Image
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 bg-white">
              <Camera className="w-5 h-5 text-gray-500" />
              <input
                type="file"
                onChange={handleFileChange}
                required
                className="mt-1 w-full bg-transparent border-none focus:outline-none"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 p-2 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={profile.dateOfBirth}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 p-2 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 p-2 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          {/* License Number */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              License Number
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={profile.licenseNumber}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 p-2 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 p-2 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-yellow-500 py-2 rounded-md hover:bg-gray-800 transition duration-300"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverProfile;
