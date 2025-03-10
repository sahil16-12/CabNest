import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RiderContext } from "../context/RiderContext";
import { toast } from "react-toastify";
import { Camera, Upload, X } from "lucide-react";
import { UserData } from "../context/UserContext";

const RiderProfile = () => {
  const navigate = useNavigate();
  const { createRider, loading, error } = useContext(RiderContext);
  const [userId, setUserId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const { isAuth, setIsAuth } = UserData();
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (!storedUserId) {
      toast.error("Please complete registration first");
      navigate("/login");
    }
    setUserId(storedUserId);
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    if (!userId) return;

    const formData = new FormData(e.target);
    formData.append("_id", userId);

    if (previewImage) {
      const response = await fetch(previewImage);
      const blob = await response.blob();
      const file = new File([blob], "profile-image.png", { type: "image/png" });
      formData.append("profileImage", file);
    }

    try {
      await createRider(formData);
      toast.success("Rider profile created successfully!");
      localStorage.removeItem("userId");
      setIsAuth(true);
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

export default RiderProfile;
