import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDriver } from "../context/DriverContext";
import { Camera, Upload, X } from "lucide-react";

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
  const [previewImage, setPreviewImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const userId = localStorage.getItem("userId");

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
    setIsModalOpen(false); // Close modal after selecting a file
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
          setIsModalOpen(false); // Close modal after taking a photo
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
            <div
              className="flex items-center justify-center border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <Camera className="w-12 h-12 text-gray-500" />
              )}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Upload Profile Photo</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleCameraClick}
                className="w-full flex items-center justify-center space-x-2 bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-600 transition duration-300"
              >
                <Camera className="w-5 h-5" />
                <span>Take Photo</span>
              </button>
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full flex items-center justify-center space-x-2 bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-600 transition duration-300"
              >
                <Upload className="w-5 h-5" />
                <span>Upload from Computer</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
