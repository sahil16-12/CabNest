import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useDriver } from "./DriverContext"; // Import the driver context
import { server } from "../main";
import { toast } from "react-toastify";

const DriverDashboardContext = createContext();

export const DriverDashboardProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { fetchDriverProfile } = useDriver();
  const { driver: currentDriver } = useDriver();
  const _id = currentDriver?._id;

  // Static driver ID for testing
  const [rideDriver, setRideDriver] = useState("67cd760142152f19081081e9");

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    earnings: { daily: 0, weekly: 0, monthly: 0, yearly: 0 },
    totalDistance: 0,
    overallRating: 0,
    status: "offline",
  });

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    if (!rideDriver) return; // Use static driver ID

    try {
      setIsLoading(true);

      // Fetch all data in parallel
      const [earningsRes, ratingRes, distanceRes, statusRes] =
        await Promise.all([
          axios.get(`${server}/api/driver/${rideDriver}/earnings`),
          axios.get(`${server}/api/driver/${rideDriver}/rating`),
          axios.get(`${server}/api/driver/${rideDriver}/total-distance`),
          axios.get(`${server}/api/driver/${rideDriver}/status`),
        ]);

      // Update state with fetched data
      setDashboardData({
        earnings: earningsRes.data.data,
        overallRating: ratingRes.data.data.averageRating,
        totalDistance: distanceRes.data.data.totalDistance,
        status: statusRes.data.data.status,
      });
    } catch (err) {
      toast.error("Failed to fetch dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (rideDriver) {
      fetchDashboardData();
    }
  }, [rideDriver]);

  // Update earnings
  const updateEarnings = async (payment) => {
    try {
      await axios.post(`${server}/api/driver/${rideDriver}/update-earnings`, {
        payment,
      });
      await fetchDashboardData(); // Refresh data
      toast.success("Earnings updated successfully");
    } catch (err) {
      toast.error("Failed to update earnings");
      console.error("Earnings error:", err);
    }
  };

  // Update rating
  const updateRating = async (rating) => {
    try {
      await axios.post(`${server}/api/driver/${rideDriver}/update-rating`, {
        rating,
      });
      await fetchDashboardData(); // Refresh data
      toast.success("Rating updated successfully");
    } catch (err) {
      toast.error("Failed to update rating");
      console.error("Rating error:", err);
    }
  };

  // Update status
  const toggleAvailability = async () => {
    try {
      const newStatus =
        dashboardData.status === "online" ? "offline" : "online";
      await axios.post(`${server}/api/driver/${rideDriver}/update-status`, {
        status: newStatus,
      });
      await fetchDashboardData(); // Refresh data
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
      console.error("Status error:", err);
    }
  };

  // Update total distance
  const updateTotalDistance = async (distance) => {
    try {
      await axios.post(`${server}/api/driver/${rideDriver}/update-distance`, {
        distance,
      });
      await fetchDashboardData(); // Refresh data
      toast.success("Distance updated successfully");
    } catch (err) {
      toast.error("Failed to update distance");
      console.error("Distance error:", err);
    }
  };

  return (
    <DriverDashboardContext.Provider
      value={{
        ...dashboardData,
        setRideDriver,
        isLoading,
        isAvailable: dashboardData.status === "online",
        toggleAvailability,
        updateEarnings,
        updateRating,
        updateTotalDistance,
        refreshData: fetchDashboardData, // Function to manually refresh data
      }}
    >
      {children}
    </DriverDashboardContext.Provider>
  );
};

export const useDriverDashboardC = () => useContext(DriverDashboardContext);
