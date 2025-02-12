import { createContext, useContext, useState } from "react";
import axios from "axios";

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

  const updateDriverProfile = async (userId, driverData) => {
    try {
      const response = await axios.put(`/api/driver/${userId}`, driverData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDriver(response.data);
    } catch (error) {
      console.error("Error updating driver profile:", error);
    }
  };

  return (
    <DriverContext.Provider
      value={{ driver, fetchDriverProfile, updateDriverProfile }}
    >
      {children}
    </DriverContext.Provider>
  );
};
