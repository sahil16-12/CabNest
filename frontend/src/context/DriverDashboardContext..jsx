import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useDriver } from "./DriverContext"; // Import the driver context
import { server } from "../main";
import { UserData } from "./UserContext";
import { toast } from "react-toastify";

const DriverDashboardContext = createContext();

export const DriverDashboardProvider = ({ children }) => {
  // Get the driver data

  // Extract the driver ID
  const [isLoading, setIsLoading] = useState(true);
  const { user } = UserData();
  const { fetchDriverProfile } = useDriver();
  const { driver: currentDriver } = useDriver();
  const _id = currentDriver?._id;
  // State initialization
  const [dashboardData, setDashboardData] = useState({
    earnings: { daily: 0, weekly: 0, monthly: 0 },
    totalDistance: 0,
    overallRating: 0,
    currentLocation: { lat: 0, lng: 0 },
    status: "offline",
  });

  const [currentLocation, setCurrentLocation] = useState({
    lat: 22.3072,
    lng: 73.1812,
  });
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user.role === "driver") await fetchDriverProfile(user._id);
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, [user?._id, user?.role]);
  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    if (!_id) return; // Wait until we have the driver ID

    try {
      setIsLoading(true);
      const [earningsRes, ratingRes, distanceRes, statusRes] =
        await Promise.all([
          axios.get(`http://localhost:5000/api/driver/earnings/${_id}`),
          axios.get(`http://localhost:5000/api/driver/rating/${_id}`),
          axios.get(`http://localhost:5000/api/driver/total-distance/${_id}`),
          axios.get(`http://localhost:5000/api/driver/status/${_id}`),
        ]);

      console.log(earningsRes.data.data);
      setDashboardData({
        earnings: earningsRes.data.data,
        overallRating: ratingRes.data.rating,
        totalDistance: distanceRes.data.totalDistance,
        status: statusRes.data.status,
        currentLocation: currentLocation,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (_id) {
      fetchDashboardData();
    }
  }, [_id]); // Add _id as dependency

  // Toggle availability
  const toggleAvailability = async () => {
    if (!_id) return;

    try {
      const newStatus =
        dashboardData.status === "online" ? "offline" : "online";
      const response = await axios.put(`${server}/api/driver/status/${_id}`, {
        status: newStatus,
      });

      setDashboardData((prev) => ({
        ...prev,
        status: response.data.status,
      }));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Simulate location updates
  useEffect(() => {
    const getLocation = () => {
      const randomLat = currentLocation.lat + (Math.random() - 0.5) * 0.005;
      const randomLng = currentLocation.lng + (Math.random() - 0.5) * 0.005;
      setCurrentLocation({ lat: randomLat, lng: randomLng });
    };

    const interval = setInterval(getLocation, 10000);
    return () => clearInterval(interval);
  }, [currentLocation]);

  return (
    <DriverDashboardContext.Provider
      value={{
        ...dashboardData,
        isLoading,
        isAvailable: dashboardData.status === "online",
        toggleAvailability,
      }}
    >
      {children}
    </DriverDashboardContext.Provider>
  );
};
export const useDriverDashboardC = () => {
  return useContext(DriverDashboardContext);
};
