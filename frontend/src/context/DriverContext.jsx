import { createContext, useContext, useState } from "react";
import axios from "axios";
import { server } from "../main";

const DriverContext = createContext();

export const useDriver = () => {
  return useContext(DriverContext);
};

export const DriverProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);

  // Fetch driver profile by user ID
  const fetchDriverProfile = async (userId) => {
    try {
      const response = await axios.get(`${server}/api/driver/${userId}`);
      console.log(response.data);
      setDriver(response.data);
      sessionStorage.setItem("driverD", JSON.stringify(response.data));

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching driver profile:", error);
    }
  };

  // Create a new driver profile
  const createDriverProfile = async (formData) => {
    try {
      const response = await axios.post(`${server}/api/driver`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDriver(response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating driver profile:", error.message);
      throw error;
    }
  };

  // Update an existing driver profile
  const updateDriverProfile = async (userId, formData) => {
    try {
      const response = await axios.put(
        `${server}/api/driver/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
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
        setDriver,
        fetchDriverProfile,
        createDriverProfile,
        updateDriverProfile,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};
