import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RiderContext } from "../context/RiderContext";
import { DriverProvider, useDriver } from "../context/DriverContext";
import { UserData } from "../context/UserContext";
import { toast } from "react-hot-toast";
import {
  Camera,
  Upload,
  X,
  Edit3,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

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
        if (formData[key] !== undefined && formData[key] !== null) {
          formPayload.append(key, formData[key]);
        }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      {/* Profile Header with Stats */}
      <div className="relative bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture with Verification Badge */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-yellow-400/50 hover:border-yellow-400 transition-all duration-300 overflow-hidden shadow-xl">
                <img
                  src={`http://localhost:5000/${normalizedImagePath}`}
                  alt="Profile"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>
              {user?.role === "driver" && currentProfile?.verified && (
                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1.5 shadow-lg">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info with Stats */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">
                  {user?.role === "driver"
                    ? currentProfile.fullName
                    : user?.name}
                </h1>
                <span className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                  {user?.role?.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/30 p-4 rounded-xl">
                  <p className="text-sm text-gray-400">Trips Completed</p>
                  <p className="text-2xl font-bold">
                    {currentProfile.tripsCount || 0}
                  </p>
                </div>
                {user?.role === "driver" && (
                  <>
                    <div className="bg-gray-700/30 p-4 rounded-xl">
                      <p className="text-sm text-gray-400">Rating</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                          {currentProfile.rating?.toFixed(1) || "4.9"}
                        </span>
                        <div className="text-yellow-400">★</div>
                      </div>
                    </div>
                    <div className="bg-gray-700/30 p-4 rounded-xl">
                      <p className="text-sm text-gray-400">Experience</p>
                      <p className="text-2xl font-bold">
                        {currentProfile.yearsExperience || 2}+ yrs
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <Edit3 className="w-5 h-5" />
                Edit
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Verified Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="border-t border-gray-700/50 my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Phone Number</p>
                  <p className="font-medium">
                    {currentProfile.phoneNumber || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="font-medium">
                    {currentProfile.address || "Not provided"}
                  </p>
                </div>
                {user?.role === "driver" && (
                  <div>
                    <p className="text-sm text-gray-400">License Number</p>
                    <p className="font-medium">
                      {currentProfile.licenseNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Form Section */}
          {isEditing && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-4">
                  {user?.role === "driver" && (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-gray-400">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        required
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">Address</label>
                    <input
                      type="text"
                      value={formData.address || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      required
                    />
                  </div>

                  {user?.role === "driver" && (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-gray-400">
                        License Number
                      </label>
                      <input
                        type="text"
                        value={formData.licenseNumber || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            licenseNumber: e.target.value,
                          })
                        }
                        className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        required
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">
                      Profile Photo
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-left hover:bg-gray-700 transition-colors"
                    >
                      Change Image
                    </button>
                  </div>

                  {previewImage && (
                    <div className="mt-4">
                      <label className="text-sm text-gray-400">Preview</label>
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="flex items-center justify-center gap-2 w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
                    >
                      {updateLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="w-full border border-gray-600 text-gray-300 py-3 rounded-lg hover:border-gray-500 hover:text-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Image Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Update Profile Photo</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleCameraClick}
                className="flex items-center justify-center gap-3 p-6 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors"
              >
                <Camera className="w-8 h-8 text-yellow-400" />
                <span className="font-medium">Take Photo</span>
              </button>

              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center justify-center gap-3 p-6 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors"
              >
                <Upload className="w-8 h-8 text-yellow-400" />
                <span className="font-medium">Upload Photo</span>
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
