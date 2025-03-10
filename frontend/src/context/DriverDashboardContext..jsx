import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useDriver } from "./DriverContext"; // Import the driver context
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
  const { driver: currentDriver } = useDriver();
  const _id = currentDriver?._id;
  const [dashboardData, setDashboardData] = useState({
    earnings: { daily: 0, weekly: 0, monthly: 0, yearly: 0 },
    totalDistance: 0,
    overallRating: 0,
    status: "offline",
  });
  const fetchDashboardData = async () => {
    if (!_id) return; // Use static driver ID

    try {
      setIsLoading(true);

      // Fetch all data in parallel
      const [earningsRes, ratingRes, distanceRes, statusRes] =
        await Promise.all([
          axios.get(`${server}/api/driver/${_id}/earnings`),
          axios.get(`${server}/api/driver/${_id}/rating`),
          axios.get(`${server}/api/driver/${_id}/total-distance`),
          axios.get(`${server}/api/driver/${_id}/status`),
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

  // useEffect(() => {
  //   if (rideDriver) {
  //     fetchDashboardData();
  //   }
  // }, [_id]);
  const updateEarnings = async (payment, id) => {
    try {
      await axios.post(`${server}/api/driver/${id}/update-earnings`, {
        payment,
      });
      // await fetchDashboardData(); // Refresh data
      toast.success("Earnings updated successfully");
    } catch (err) {
      toast.error("Failed to update earnings");
      console.error("Earnings error:", err);
    }
  };

  // Update rating
  const updateRating = async (rating, id) => {
    try {
      await axios.post(`${server}/api/driver/${id}/update-rating`, {
        rating,
      });
      // await fetchDashboardData(); // Refresh data
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
      await axios.post(`${server}/api/driver/${_id}/update-status`, {
        status: newStatus,
      });
      // await fetchDashboardData(); // Refresh data
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
      // await fetchDashboardData(); // Refresh data
      toast.success("Distance updated successfully");
    } catch (err) {
      toast.error("Failed to update distance");
      console.error("Distance error:", err);
    }
  };
  // Fetch completed rides for a driver
  const fetchCompletedRides = async (_id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/dashboard/rides/completed/${_id}`);
      setCompletedRides(response.data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch completed rides"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch canceled rides for a driver
  const fetchCanceledRides = async (_id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/dashboard/rides/canceled/${_id}`);
      setCanceledRides(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch canceled rides");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch today's ride count for a driver
  const fetchTodayRideCount = async (_id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/dashboard/rides/today/${_id}`);
      setTodayRideCount(response.data.count);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch today's ride count"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch recent rides for a driver
  const fetchRecentRides = async (_id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/dashboard/rides/recent/${_id}`);
      setRecentRides(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch recent rides");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all ride data for a driver
  const fetchDriverRideData = async (_id) => {
    await fetchCompletedRides(_id);
    await fetchCanceledRides(_id);
    await fetchTodayRideCount(_id);
    await fetchRecentRides(_id);
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
        refreshData: fetchDashboardData,
        error,
        fetchDriverRideData, // Function to manually refresh data
      }}
    >
      {children}
    </DriverDashboardContext.Provider>
  );
};

export const useDriverDashboardC = () => useContext(DriverDashboardContext);
