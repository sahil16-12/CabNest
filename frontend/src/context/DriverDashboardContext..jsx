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

  const fetchDashboardData = async () => {
    if (!_id) return;

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
      toast.error("Failed to fetch dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data whenever _id changes or manual refresh
  useEffect(() => {
    if (_id) {
      fetchDashboardData();
      fetchDriverRideData();
    }
  }, [_id]);

  // Unified refresh function
  const refreshAllData = async () => {
    await fetchDashboardData();
    await fetchDriverRideData();
  };

  // Update functions
  const updateEarnings = async (payment, id) => {
    try {
      await axios.post(`${server}/api/driver/${id}/update-earnings`, {
        payment,
      });
      // await fetchDashboardData(); // Refresh after update
      toast.success("Earnings updated successfully");
    } catch (err) {
      toast.error("Failed to update earnings");
      console.error("Earnings error:", err);
    }
  };

  const updateRating = async (rating, id) => {
    try {
      await axios.post(`${server}/api/driver/${id}/update-rating`, { rating });
      // await fetchDashboardData(); // Refresh after update
      toast.success("Rating updated successfully");
    } catch (err) {
      toast.error("Failed to update rating");
      console.error("Rating error:", err);
    }
  };

  const toggleAvailability = async () => {
    try {
      const newStatus =
        dashboardData.status === "online" ? "offline" : "online";
      await axios.post(`${server}/api/driver/${_id}/update-status`, {
        status: newStatus,
      });
      await fetchDashboardData(); // Refresh after update
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
      console.error("Status error:", err);
    }
  };

  const updateTotalDistance = async (distance, id) => {
    try {
      await axios.post(`${server}/api/driver/${id}/update-distance`, {
        distance,
      });
      // await fetchDashboardData(); // Refresh after update
      toast.success("Distance updated successfully");
    } catch (err) {
      toast.error("Failed to update distance");
      console.error("Distance error:", err);
    }
  };

  // Ride data fetching functions
  const fetchCompletedRides = async () => {
    try {
      const response = await axios.get(
        `${server}/dashboard/rides/completed/${_id}`
      );
      setCompletedRides(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch completed rides"
      );
    }
  };

  const fetchCanceledRides = async () => {
    try {
      const response = await axios.get(
        `${server}/dashboard/rides/canceled/${_id}`
      );
      setCanceledRides(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch canceled rides");
    }
  };

  const fetchTodayRideCount = async () => {
    try {
      const response = await axios.get(
        `${server}/dashboard/rides/today/${_id}`
      );
      setTodayRideCount(response.data.count);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch today's ride count"
      );
    }
  };

  const fetchRecentRides = async () => {
    try {
      const response = await axios.get(
        `${server}/dashboard/rides/recent/${_id}`
      );
      setRecentRides(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch recent rides");
    }
  };

  const fetchDriverRideData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchCompletedRides(),
        fetchCanceledRides(),
        fetchTodayRideCount(),
        fetchRecentRides(),
      ]);
    } catch (err) {
      setError("Failed to fetch some ride data");
    } finally {
      setIsLoading(false);
    }
  };

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
