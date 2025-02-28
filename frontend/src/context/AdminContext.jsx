import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserData } from "./UserContext";
import { server } from "../main";
import { useCallback } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = UserData();

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
  console.log(user);
  // Get dashboard stats
  const getDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/admin/dashboard`, {
        headers: { token: localStorage.getItem("token") },
      });
      console.log(data);
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all users
  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/admin/users`, config);
      setUsers(data.users);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete user
  const deleteUser = async (userId) => {
    try {
      setLoading(true);
      await axios.delete(`${server}/api/admin/users/${userId}`, config);
      setUsers(users.filter((user) => user._id !== userId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      getDashboardStats();
      getAllUsers();
    }
  }, [user]);

  return (
    <AdminContext.Provider
      value={{
        stats,
        users,
        loading,
        error,
        getDashboardStats,
        getAllUsers,
        deleteUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
