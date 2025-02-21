import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RiderContext } from "../context/RiderContext";
import { DriverProvider, useDriver } from "../context/DriverContext";
import { UserData } from "../context/UserContext";
import { toast } from "react-hot-toast";
import { Camera, Upload, X } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = UserData();
  const {
    rider,
    loading: riderLoading,
    getRiderById,
    updateRider,
  } = useContext(RiderContext);
  const {
    driver,
    loading: driverLoading,
    fetchDriverProfile,
    updateDriverProfile,
  } = useDriver();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const isLoading = user?.role === "rider" ? riderLoading : driverLoading;
  const currentProfile = user?.role === "rider" ? rider : driver;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;
        if (user.role === "rider") await getRiderById(user._id);
        else if (user.role === "driver") await fetchDriverProfile(user._id);
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, [user?.id, user?.role]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewImage(preview);
      setFormData((prev) => ({ ...prev, profileImage: file }));
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
          setFormData((prev) => ({ ...prev, profileImage: file }));
          setPreviewImage(URL.createObjectURL(file));
          setIsModalOpen(false);
        }, "image/png");

        stream.getTracks().forEach((track) => track.stop());
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error(
        "Failed to access camera. Please ensure you have granted permissions."
      );
    }
  };

  const handleEditClick = () => {
    setFormData(currentProfile);
    setIsEditing(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const formPayload = new FormData();
      for (const key in formData) {
        formPayload.append(key, formData[key]);
      }

      if (user.role === "rider") {
        await updateRider(user._id, formPayload);
        await getRiderById(user._id);
      } else {
        await updateDriverProfile(user._id, formPayload);
        await fetchDriverProfile(user._id);
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      setPreviewImage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (isLoading)
    return <div className="text-center py-8">Loading profile...</div>;
  if (!currentProfile)
    return <div className="text-center py-8">No profile found</div>;

  const normalizedImagePath = currentProfile.profileImage.replace(/\\/g, "/");

  return (
    <div className="max-w-4xl mx-auto p-4 bg-black text-yellow-500">
      {/* Profile Header */}
      <div className="flex flex-col items-center md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
        {/* Profile Picture */}
        <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-yellow-500 shadow-lg">
          <img
            src={`http://localhost:5000/${normalizedImagePath}`}
            alt="Profile"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150"; // Fallback image
            }}
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold">
            {user?.role === "driver" ? currentProfile.fullName : user?.name}
          </h1>
          <p className="text-gray-300">{user?.email}</p>
          <p className="text-gray-300">{currentProfile.phoneNumber}</p>
          <p className="text-gray-300">{currentProfile.address}</p>
          {user?.role === "driver" && (
            <p className="text-gray-300">{currentProfile.licenseNumber}</p>
          )}

          {/* Edit Button */}
          <button
            onClick={handleEditClick}
            className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors animate-pulse"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleUpdateProfile} className="mt-8 space-y-6">
          {user?.role === "driver" && (
            <div>
              <label className="block text-gray-200 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full p-3 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-gray-200 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber || ""}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="w-full p-3 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-2">Address</label>
            <input
              type="text"
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full p-3 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          {user?.role === "driver" && (
            <div>
              <label className="block text-gray-200 mb-2">License Number</label>
              <input
                type="text"
                value={formData.licenseNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
                className="w-full p-3 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-gray-200 mb-2">Profile Photo</label>
            <div className="flex gap-4">
              {/* Upload from computer */}
              <label
                className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                Change Image
              </label>
            </div>
          </div>
          {/* Image Preview */}
          {previewImage && (
            <div className="mt-4">
              <label className="block text-gray-200 mb-2">Preview</label>
              <img
                src={previewImage}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500"
              />
            </div>
          )}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={updateLoading}
              className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 disabled:bg-gray-400 transition-colors flex items-center animate-bounce"
            >
              {updateLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setPreviewImage("");
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Modal for Upload or Take Photo */}
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

export default ProfilePage;
