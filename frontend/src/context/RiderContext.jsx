import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { server } from "../main";

// Create Context
export const RiderContext = createContext();

// Rider Provider Component
export const RiderProvider = ({ children }) => {
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch rider by ID
  const getRiderById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/api/rider/${id}`);
      setRider(response.data);
      localStorage.setItem("rider", response.rider);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching rider");
    }
    setLoading(false);
  };

  // Create a new rider
  const createRider = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${server}/api/rider`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRider(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating rider");
    }
    setLoading(false);
  };

  // Update rider by ID
  const updateRider = async (id, formData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${server}/api/rider/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRider(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating rider");
    }
    setLoading(false);
  };

  // Delete rider by ID
  const deleteRider = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${server}/api/riders/${id}`);
      setRider(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting rider");
    }
    setLoading(false);
  };

  return (
    <RiderContext.Provider
      value={{
        rider,
        loading,
        error,
        getRiderById,
        createRider,
        updateRider,
        deleteRider,
      }}
    >
      {children}
    </RiderContext.Provider>
  );
};
