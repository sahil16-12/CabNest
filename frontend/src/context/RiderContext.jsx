import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
const RiderContext = createContext();

// Provider Component
export const RiderProvider = ({ children }) => {
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch rider profile
  const fetchRiderProfile = async (riderId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/rider/${riderId}`);
      setRider(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch rider data");
    }
    setLoading(false);
  };

  // Update rider profile
  const updateRiderProfile = async (riderId, updatedData) => {
    setLoading(true);
    try {
      const { data } = await axios.put(`/api/rider/${riderId}`, updatedData);
      setRider(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update rider data");
    }
    setLoading(false);
  };

  // Delete rider profile
  const deleteRiderProfile = async (riderId) => {
    setLoading(true);
    try {
      await axios.delete(`/api/rider/${riderId}`);
      setRider(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete rider profile");
    }
    setLoading(false);
  };

  return (
    <RiderContext.Provider
      value={{
        rider,
        loading,
        error,
        fetchRiderProfile,
        updateRiderProfile,
        deleteRiderProfile,
      }}
    >
      {children}
    </RiderContext.Provider>
  );
};

// Custom hook to use RiderContext
export const useRider = () => {
  return useContext(RiderContext);
};
