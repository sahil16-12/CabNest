import { createContext, useContext, useState } from "react";
import axios from "axios";
import { server } from "../main";

const DriverContext = createContext();

export const useDriver = () => {
  return useContext(DriverContext);
};

export const DriverProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);

  const fetchDriverProfile = async (userId) => {
    try {
      const response = await axios.get(`/api/driver/${userId}`);
      setDriver(response.data);
    } catch (error) {
      console.error("Error fetching driver profile:", error);
    }
  };

  const createDriverProfile = async (formData) => {
    try {
      const response = await axios.post(`${server}/api/driver`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDriver(response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating driver profile:", error);
      throw error;
    }
  };

  const updateDriverProfile = async (userId, formData) => {
    try {
      const response = await axios.put(`/api/driver/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDriver(response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating driver profile:", error);
      throw error;
    }
  };

  return (
    <DriverContext.Provider
      value={{
        driver,
        fetchDriverProfile,
        createDriverProfile,
        updateDriverProfile,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};
