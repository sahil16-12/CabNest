import { useEffect, useState } from "react";

import {
  MapPin,
  DollarSign,
  Navigation,
  Car,
  ArrowUpRight,
  User,
  Power,
  Bell,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Circle,
  Package,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useDriverDashboardC } from "../context/DriverDashboardContext.";
import { io } from "socket.io-client";
import axios from "axios";
import { server } from "../main";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserData } from "../context/UserContext";

// Helper component to update the map center when the coordinates change
function RecenterAutomatically({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

const DriverDashboard = (user) => {
  const navigate = useNavigate();
  const {
    isLoading,
    isAvailable,
    status,
    earnings,
    totalDistance,
    overallRating,
    completedRides,
    canceledRides,
    todayRideCount,
    recentRides,
    toggleAvailability,
    updateEarnings,
    updateRating,
    updateTotalDistance,
    refreshData,
    error,
    fetchDriverRideData,
    setRideDriver,
    currentLocation,
  } = useDriverDashboardC();

  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const driverData = sessionStorage.getItem("driver");
  const parsedDriver = JSON.parse(driverData);
  const USER = sessionStorage.getItem("USER");
  const parsedUser = JSON.parse(USER);

  // Get the driver's location (with fallback values)
  const driverLocation = parsedDriver?.currentLocation;
  const lat = driverLocation?.coordinates[1] || 0;
  const lng = driverLocation?.coordinates[0] || 0;

  const { logout } = UserData();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Create a custom icon for the marker
  const customIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: rgba(37, 99, 235, 0.2); width: 48px; height: 48px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
             <div style="background-color: rgba(37, 99, 235, 0.4); width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
               <div style="color: rgb(37, 99, 235); transform: translate(0, -4px);">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-map-pin">
                   <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                   <circle cx="12" cy="10" r="3"/>
                 </svg>
               </div>
             </div>
           </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

  // Socket connection and notifications for ride requests
  useEffect(() => {
    const newSocket = io(`${server}`);
    setSocket(newSocket);

    if (driverData) {
      const parsedDriver = JSON.parse(driverData);
      newSocket.emit("register-driver", parsedDriver._id);

      newSocket.on("new-ride-request", (data) => {
        setNotifications((prev) => [data, ...prev]);

        try {
          const audio = new Audio("../assets/notification-sound.mp3");
          audio.play();
        } catch (error) {
          console.error("Could not play notification sound", error);
        }

        toast.info("New ride request received!", {
          position: "top-right",
          autoClose: 5000,
        });
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [currentLocation, driverData]);

  const handleResponse = async (notificationId, response) => {
    const driverData = sessionStorage.getItem("driver");
    if (!driverData) {
      toast.error("Driver session not found");
      return;
    }

    const driver = JSON.parse(driverData);
    try {
      setShowNotifications(false);
      const toastId = toast.loading(
        response === "accepted" ? "Accepting ride..." : "Rejecting ride..."
      );

      const res = await axios.post(
        `${server}/api/notifications/${notificationId}/${response}`,
        driver
      );

      toast.dismiss(toastId);

      if (response === "accepted") {
        toast.success("Ride accepted successfully!");
        const acceptedNotification = notifications.find(
          (n) => n._id === notificationId
        );

        if (acceptedNotification) {
          navigate("/active-ride", {
            state: {
              ride: acceptedNotification.ride,
              driver: driver,
              otp: res.data.otp || "1234",
            },
          });
        }
      } else {
        toast.info("Ride rejected");
      }

      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error responding to ride request"
      );
      console.error("Error responding to ride:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">
                Driver Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {parsedUser.name || "Driver"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Bell className="h-6 w-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-lg flex items-center">
                        <Bell className="w-5 h-5 mr-2 text-blue-600" />
                        Ride Requests
                      </h3>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No ride requests
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className="p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 p-2 bg-blue-100 text-blue-600 rounded-full">
                                <Car className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {notification.message || "New ride request"}
                                </p>
                                <div className="mt-1 flex flex-col space-y-1">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                    <span className="line-clamp-1">
                                      {notification.ride?.pickup?.address ||
                                        "Unknown pickup"}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Navigation className="h-4 w-4 mr-1 text-gray-400" />
                                    <span className="line-clamp-1">
                                      {notification.ride?.drop?.address ||
                                        "Unknown destination"}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                                    <span className="font-medium text-green-600">
                                      ₹{notification.ride?.fare || "0"}
                                    </span>
                                    <span className="mx-2 text-gray-400">
                                      •
                                    </span>
                                    <Car className="h-4 w-4 mr-1 text-gray-400" />
                                    <span className="text-gray-600">
                                      {notification.ride?.distance || "0"} km
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 flex justify-end gap-2">
                              <button
                                onClick={() =>
                                  handleResponse(notification._id, "rejected")
                                }
                                className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() =>
                                  handleResponse(notification._id, "accepted")
                                }
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                              >
                                Accept
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={toggleAvailability}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isAvailable
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                <Power className="h-4 w-4 mr-2" />
                {isAvailable ? "Available" : "Unavailable"}
              </button>
              <a
                href="/profile-page"
                className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </a>
              <div className="fixed bottom-6 right-6 z-50 group">
                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                  style={{
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)",
                    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                  }}
                >
                  {/* Animated arrow icon */}
                  <div className="relative w-5 h-5">
                    <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:-translate-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-100"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-100"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <span className="text-gray-100 font-medium tracking-wide text-sm">
                    Back to Home
                  </span>
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-600 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                {/* Daily Earnings */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-2" /> Daily Earnings
                      </h3>
                      <p className="text-3xl font-bold text-gray-900 mt-3">
                        ₹{earnings.daily.toFixed(2)}
                      </p>
                      <span className="text-green-600 text-sm flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 mr-1.5" />
                        12% more than yesterday
                      </span>
                    </div>
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Weekly Earnings */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-2" /> Weekly Earnings
                      </h3>
                      <p className="text-3xl font-bold text-gray-900 mt-3">
                        ₹{earnings.weekly.toFixed(2)}
                      </p>
                      <span className="text-green-600 text-sm flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 mr-1.5" />
                        8% more than last week
                      </span>
                    </div>
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Monthly Earnings */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-2" /> Monthly Earnings
                      </h3>
                      <p className="text-3xl font-bold text-gray-900 mt-3">
                        ₹{earnings.monthly.toFixed(2)}
                      </p>
                      <span className="text-green-600 text-sm flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 mr-1.5" />
                        5% more than last month
                      </span>
                    </div>
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Yearly Earnings */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-2" /> Yearly Earnings
                      </h3>
                      <p className="text-3xl font-bold text-gray-900 mt-3">
                        ₹{earnings.yearly.toFixed(2)}
                      </p>
                      <span className="text-green-600 text-sm flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 mr-1.5" />
                        12% more than last year
                      </span>
                    </div>
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Total Earnings */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-2" /> Total Earnings
                      </h3>
                      <p className="text-3xl font-bold text-gray-900 mt-3">
                        ₹{Number(earnings.total || 0).toFixed(2)}
                      </p>
                      <span className="text-green-600 text-sm flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 mr-1.5" />
                        12.5% overall growth
                      </span>
                    </div>
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Preview using React Leaflet */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100">
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                      Live Location
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center text-sm text-gray-600">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Live Tracking
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-blue-600 mr-1" />
                    <span>
                      Current: {lat.toFixed(4)}°N, {lng.toFixed(4)}°W
                    </span>
                  </div>
                </div>
                <MapContainer
                  center={[lat, lng]}
                  zoom={14}
                  scrollWheelZoom={true}
                  style={{ height: "200px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[lat, lng]} icon={customIcon}>
                    <Popup>Your current location</Popup>
                  </Marker>
                  <RecenterAutomatically lat={lat} lng={lng} />
                </MapContainer>
              </div>

              {/* Recent Rides */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 pb-0">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Rides
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3 border-b border-gray-200">
                          From/To
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200">
                          Date
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200">
                          Distance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentRides.map((ride) => (
                        <tr
                          key={ride.id}
                          className="hover:bg-gray-50 transition-colors text-sm"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {ride.fromAddress}
                            </div>
                            <div className="text-gray-500 flex items-center mt-1">
                              <Circle className="h-3 w-3 mr-2 text-gray-400 inline" />
                              {ride.toAddress}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {new Date(ride.date).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {ride.distance} km
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              {/* Driver Status Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Driver Status
                  </h2>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" /> Rating
                    </span>
                    <span className="font-medium text-gray-900">
                      {overallRating.toFixed(2)}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Car className="h-4 w-4 mr-2 text-blue-500" /> Total
                      Distance
                    </span>
                    <span className="font-medium text-gray-900">
                      {totalDistance.toFixed(2)} km
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />{" "}
                      Accepted Rides
                    </span>
                    <span className="font-medium text-gray-900">
                      {completedRides.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-2 text-red-500" /> Rejected
                      Rides
                    </span>
                    <span className="font-medium text-gray-900">
                      {canceledRides.length}
                    </span>
                  </div>
                </div>
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Acceptance Rate
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (completedRides.length /
                            (completedRides.length + canceledRides.length)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-green-600 font-medium flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" /> Today&apos;s Rides
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {todayRideCount}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-blue-600 font-medium flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1" /> Online Hours
                  </div>
                  <div className="text-2xl font-bold mt-1">6.5h</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Updates
                </h2>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="font-medium text-blue-800">
                      New Fare Rates
                    </div>
                    <p className="text-sm text-blue-600 mt-1">
                      Fare rates have been updated for peak hours. Check the
                      details.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="font-medium text-green-800">
                      Bonus Opportunity
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Complete 15 rides this weekend to earn a ₹500 bonus!
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="font-medium text-yellow-800">
                      App Update
                    </div>
                    <p className="text-sm text-yellow-600 mt-1">
                      New version available with improved navigation features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
