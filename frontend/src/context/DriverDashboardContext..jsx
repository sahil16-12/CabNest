import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { server } from "../main";
import { toast } from "react-toastify";

const DriverDashboardContext = createContext();

export const DriverDashboardProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [completedRides, setCompletedRides] = useState([]);
  const [canceledRides, setCanceledRides] = useState([]);
  const [todayRideCount, setTodayRideCount] = useState(0);
  const [recentRides, setRecentRides] = useState([]);
  const [error, setError] = useState(null);

  // Get current driver from sessionStorage
  const currentDriver = JSON.parse(sessionStorage.getItem("driverD"));
  const _id = currentDriver?._id;

  const [dashboardData, setDashboardData] = useState({
    earnings: { daily: 0, weekly: 0, monthly: 0, yearly: 0 },
    totalDistance: 0,
    overallRating: 0,
    status: "offline",
  });

  // Fetch dashboard data (earnings, rating, distance, status)
  const fetchDashboardData = async () => {
    if (!_id) {
      toast.error("Driver ID not found. Please log in again.");
      return;
    }

    try {
      setIsLoading(true);
      const [earningsRes, ratingRes, distanceRes, statusRes] =
        await Promise.all([
          axios.get(`${server}/api/driver/${_id}/earnings`),
          axios.get(`${server}/api/driver/${_id}/rating`),
          axios.get(`${server}/api/driver/${_id}/total-distance`),
          axios.get(`${server}/api/driver/${_id}/status`),
        ]);

      setDashboardData({
        earnings: earningsRes.data.data,
        overallRating: ratingRes.data.data.averageRating,
        totalDistance: distanceRes.data.data.totalDistance,
        status: statusRes.data.data.status,
      });
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("Driver not found");
      } else {
        toast.error("Failed to fetch dashboard data");
      }
      console.error("Dashboard error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch ride-related data (completed, canceled, today's count, recent rides)
  const fetchDriverRideData = async () => {
    if (!_id) return;

    try {
      setIsLoading(true);
      const [completedRes, canceledRes, todayCountRes, recentRes] =
        await Promise.all([
          axios.get(`${server}/api/driver/rides/completed/${_id}`),
          axios.get(`${server}/api/driver/rides/canceled/${_id}`),
          axios.get(`${server}/api/driver/rides/today/${_id}`),
          axios.get(`${server}/api/driver/rides/recent/${_id}`),
        ]);

      setCompletedRides(completedRes.data);
      setCanceledRides(canceledRes.data);
      setTodayRideCount(todayCountRes.data.count);
      setRecentRides(recentRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch ride data");
      console.error("Ride data error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh all data (dashboard and ride data)
  const refreshAllData = async () => {
    await fetchDashboardData();
    await fetchDriverRideData();
  };

  // Update earnings
  const updateEarnings = async (payment, id) => {
    try {
      await axios.post(`${server}/api/driver/${id}/update-earnings`, {
        payment,
      });
      toast.success("Earnings updated successfully");
    } catch (err) {
      toast.error("Failed to update earnings");
      console.error("Earnings error:", err);
    }
  };

  // Update rating
  const updateRating = async (rating, id) => {
    try {
      await axios.post(`${server}/api/driver/${id}/update-rating`, { rating });
      toast.success("Rating updated successfully");
    } catch (err) {
      toast.error("Failed to update rating");
      console.error("Rating error:", err);
    }
  };

  // Toggle driver availability (online/offline)
  const toggleAvailability = async () => {
    try {
      const newStatus =
        dashboardData.status === "online" ? "offline" : "online";
      await axios.post(`${server}/api/driver/${_id}/update-status`, {
        status: newStatus,
      });
      setDashboardData((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
      console.error("Status error:", err);
    }
  };

  // Update total distance
  const updateTotalDistance = async (distance, id) => {
    try {
      await axios.post(`${server}/api/driver/${id}/update-distance`, {
        distance,
      });
      toast.success("Distance updated successfully");
    } catch (err) {
      toast.error("Failed to update distance");
      console.error("Distance error:", err);
    }
  };

  // Fetch data on component mount or when _id changes
  useEffect(() => {
    if (_id) {
      refreshAllData();
    } else {
      toast.error("Driver ID not found. Please log in again.");
    }
  }, [_id]);

  return (
    <DriverDashboardContext.Provider
      value={{
        ...dashboardData,
        isLoading,
        isAvailable: dashboardData.status === "online",
        completedRides,
        canceledRides,
        todayRideCount,
        recentRides,
        toggleAvailability,
        updateEarnings,
        updateRating,
        updateTotalDistance,
        refreshData: refreshAllData,
        error,
        fetchDriverRideData,
      }}
    >
      {children}
    </DriverDashboardContext.Provider>
  );
};

export const useDriverDashboardC = () => useContext(DriverDashboardContext);
