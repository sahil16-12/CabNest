import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDriver } from "../context/DriverContext";
import { Camera, Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { UserData } from "../context/UserContext";

const DriverProfile = () => {
  const navigate = useNavigate();
  const { createDriverProfile } = useDriver();
  const { setIsAuth } = UserData();
  const [profile, setProfile] = useState({
    phoneNumber: "",
    dateOfBirth: "",
    profileImage: "",
    licenseNumber: "",
    address: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    vehicleType: "",
    regNumber: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const userId = sessionStorage.getItem("userId");

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
    setIsModalOpen(false);
  };

  const handleCameraClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      video.addEventListener("canplay", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          const file = new File([blob], "profile-image.png", {
            type: "image/png",
          });
          setProfile({ ...profile, profileImage: file });
          setPreviewImage(URL.createObjectURL(file));
          setIsModalOpen(false);
        }, "image/png");

        stream.getTracks().forEach((track) => track.stop());
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Failed to access camera. Please ensure you have granted permissions."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (profile.profileImage instanceof File) {
        formData.append("profileImage", profile.profileImage);
      }
      // Append other fields
      formData.append("phoneNumber", profile.phoneNumber);
      formData.append("dateOfBirth", profile.dateOfBirth);
      formData.append("licenseNumber", profile.licenseNumber);
      formData.append("address", profile.address);
      formData.append("vehicleMake", profile.vehicleMake);
      formData.append("vehicleModel", profile.vehicleModel);
      formData.append("vehicleYear", profile.vehicleYear);
      formData.append("vehicleColor", profile.vehicleColor);
      formData.append("vehicleType", profile.vehicleType);
      formData.append("regNumber", profile.regNumber);
      formData.append("_id", userId);

      await createDriverProfile(formData);
      toast.success("Driver profile created successfully!");
      setIsAuth(true);
      navigate("/login");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please check the provided information.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Main Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          Complete Your Driver Profile
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 cursor-pointer"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <Camera className="w-12 h-12 text-gray-400" />
              )}
            </motion.div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={profile.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* License Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Number
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={profile.licenseNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Vehicle Make */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Make
            </label>
            <input
              type="text"
              name="vehicleMake"
              value={profile.vehicleMake}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Vehicle Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Model
            </label>
            <input
              type="text"
              name="vehicleModel"
              value={profile.vehicleModel}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Vehicle Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Year
            </label>
            <input
              type="number"
              name="vehicleYear"
              value={profile.vehicleYear}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Vehicle Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Color
            </label>
            <input
              type="text"
              name="vehicleColor"
              value={profile.vehicleColor}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Number
            </label>
            <input
              type="text"
              name="regNumber"
              value={profile.regNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              value={profile.vehicleType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Select Vehicle Type</option>
              <option value="bike">Bike</option>
              <option value="auto">Auto</option>
              <option value="car">Car</option>
              <option value="scooter">Scooter</option>
            </select>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all"
          >
            Save & Continue
          </motion.button>
        </form>
      </motion.div>

      {/* Image Upload Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-2xl shadow-lg w-96"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Upload Profile Photo
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCameraClick}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all"
              >
                <Camera className="w-5 h-5" />
                <span>Take Photo</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current.click()}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all"
              >
                <Upload className="w-5 h-5" />
                <span>Upload from Computer</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default DriverProfile;
