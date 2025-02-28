import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { useAdmin } from "../context/AdminContext";

const AdminDashboard = () => {
  const { user, loading: userLoading } = UserData();
  const navigate = useNavigate();

  const {
    stats,
    users = [],
    loading: adminLoading,
    error,
    getDashboardStats,
    getAllUsers,
    deleteUser,
  } = useAdmin();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    if (!userLoading && user?.role !== "admin") {
      navigate("/");
    }
  }, [user, userLoading, navigate]);

  useEffect(() => {
    if (user?.role === "admin") {
      getDashboardStats();
      getAllUsers();
    }
  }, [user?.role, getDashboardStats, getAllUsers]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  if (userLoading || adminLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-teal-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mx-4 mt-4">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-indigo-50 p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-teal-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Users
          </h2>
          <p className="text-4xl font-bold text-teal-600">
            {stats?.totalUsers || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-indigo-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Drivers
          </h2>
          <p className="text-4xl font-bold text-indigo-600">
            {stats?.totalDrivers || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-purple-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Riders
          </h2>
          <p className="text-4xl font-bold text-purple-600">
            {stats?.totalRiders || 0}
          </p>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search users..."
              className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="driver">Driver</option>
              <option value="rider">Rider</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === "driver"
                            ? "bg-indigo-100 text-indigo-800"
                            : user.role === "rider"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        className="text-teal-600 hover:text-teal-800 mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl border border-gray-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            {selectedUser && (
              <div className="p-6 space-y-4">
                {/* User Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-gray-700">
                    <strong>Name:</strong> {selectedUser.name}
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p className="text-gray-700">
                    <strong>Role:</strong> {selectedUser.role}
                  </p>
                  <p className="text-gray-700">
                    <strong>Joined:</strong>{" "}
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Role-Specific Details */}
                {selectedUser.role === "rider" && (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      <strong>Phone Number:</strong> {selectedUser.phoneNumber}
                    </p>
                    <p className="text-gray-700">
                      <strong>Date of Birth:</strong>{" "}
                      {new Date(selectedUser.dateOfBirth).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">
                      <strong>Address:</strong> {selectedUser.address}
                    </p>
                  </div>
                )}

                {selectedUser.role === "driver" && (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      <strong>Full Name:</strong> {selectedUser.fullName}
                    </p>
                    <p className="text-gray-700">
                      <strong>License Number:</strong>{" "}
                      {selectedUser.licenseNumber}
                    </p>
                  </div>
                )}

                {/* Profile Image */}
                {selectedUser.profileImage && (
                  <div className="mt-4">
                    <strong className="text-gray-700">Profile Image:</strong>
                    <img
                      src={`http://localhost:5000/${selectedUser.profileImage.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover mt-2"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
