import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  MapPin,
  DollarSign,
  Users,
  Bell,
  Clipboard,
  Settings,
  LogOut,
  Check,
  ChevronRight,
  Calendar,
  Clock,
  BarChart2,
  Award,
  ArrowUpRight,
  Car,
  Navigation,
  Gift,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaRupeeSign } from "react-icons/fa";
import { Link } from "react-router-dom";

const DriverDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState(87.5);
  const [completedRides, setCompletedRides] = useState(5);
  const [totalDistance, setTotalDistance] = useState(42.7);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 22.3072,
    lng: 73.1812,
  });
  const [driverId, setDriverId] = useState(null);
  const [weeklyEarnings, setWeeklyEarnings] = useState([
    { day: "Mon", amount: 65 },
    { day: "Tue", amount: 75 },
    { day: "Wed", amount: 90 },
    { day: "Thu", amount: 55 },
    { day: "Fri", amount: 87.5 },
    { day: "Sat", amount: 120 },
    { day: "Sun", amount: 0 },
  ]);
  const [upcomingRides, setUpcomingRides] = useState([
    {
      id: 1,
      pickup: "Central Park",
      dropoff: "Times Square",
      time: "10:30 AM",
      distance: "2.3 miles",
      fare: "₹18.50",
    },
    {
      id: 2,
      pickup: "Brooklyn Heights",
      dropoff: "Manhattan Bridge",
      time: "12:15 PM",
      distance: "3.8 miles",
      fare: "24.75",
    },
  ]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New ride request nearby",
      time: "2 mins ago",
      read: false,
      urgent: true,
    },
    {
      id: 2,
      message: "Your daily summary is ready",
      time: "1 hour ago",
      read: false,
      urgent: false,
    },
    {
      id: 3,
      message: "Bonus opportunity: Complete 10 rides today for $50 extra",
      time: "3 hours ago",
      read: true,
      urgent: false,
    },
    {
      id: 4,
      message: "System maintenance scheduled for tomorrow 2-4 AM",
      time: "5 hours ago",
      read: true,
      urgent: false,
    },
  ]);
  useEffect(() => {
    const driverData = localStorage.getItem("driver");
    if (driverData && driverData._id) {
      setDriverId(driverData._id);
    }
    const socket = io("http://localhost:5000"); // Adjust for production

    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Send location update to backend
          socket.emit("updateLocation", { driverId, latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    return () => {
      socket.disconnect(); // Cleanup on component unmount
    };
  }, []);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
    setHasNotifications(false);
  };

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [currentLocation.lat, currentLocation.lng],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: rgba(37, 99, 235, 0.2); width: 48px; height: 48px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                <div style="background-color: rgba(37, 99, 235, 0.4); width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                  <div style="color: rgb(37, 99, 235); transform: translate(0, -4px);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                </div>
              </div>`,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      markerRef.current = L.marker([currentLocation.lat, currentLocation.lng], {
        icon: customIcon,
      })
        .addTo(mapInstanceRef.current)
        .bindPopup("Your current location");

      const zoomControl = L.control.zoom({
        position: "topleft",
      });
      zoomControl.addTo(mapInstanceRef.current);

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([currentLocation.lat, currentLocation.lng]);
      mapInstanceRef.current.panTo([currentLocation.lat, currentLocation.lng]);
    }
  }, [currentLocation]);

  useEffect(() => {
    const getLocation = () => {
      const randomLat = currentLocation.lat + (Math.random() - 0.5) * 0.005;
      const randomLng = currentLocation.lng + (Math.random() - 0.5) * 0.005;
      setCurrentLocation({ lat: randomLat, lng: randomLng });
    };

    const interval = setInterval(getLocation, 10000);
    return () => clearInterval(interval);
  }, [currentLocation]);

  const maxEarning = Math.max(...weeklyEarnings.map((day) => day.amount));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-gradient-to-b from-blue-700 to-blue-600 flex flex-col shadow-xl">
        <div className="p-6 flex items-center justify-center md:justify-start">
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold shadow-md">
            D
          </div>
          <span className="ml-3 text-xl font-bold text-white hidden md:block">
            DriverHub
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <a
            href="#"
            className="flex items-center px-4 py-3 text-white bg-blue-800 bg-opacity-40 rounded-xl shadow-sm"
          >
            <Clipboard className="h-5 w-5" />
            <span className="ml-3 hidden md:block font-medium">Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-800 hover:bg-opacity-30 rounded-xl transition duration-150"
          >
            <FaRupeeSign className="h-5 w-5" />
            <span className="ml-3 hidden md:block">Earnings</span>
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-800 hover:bg-opacity-30 rounded-xl transition duration-150"
          >
            <Users className="h-5 w-5" />
            <span className="ml-3 hidden md:block">Rides</span>
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-800 hover:bg-opacity-30 rounded-xl transition duration-150"
          >
            <Car className="h-5 w-5" />
            <span className="ml-3 hidden md:block">My Vehicle</span>
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-800 hover:bg-opacity-30 rounded-xl transition duration-150"
          >
            <Award className="h-5 w-5" />
            <span className="ml-3 hidden md:block">Rewards</span>
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-800 hover:bg-opacity-30 rounded-xl transition duration-150"
          >
            <Settings className="h-5 w-5" />
            <span className="ml-3 hidden md:block">Settings</span>
          </a>
        </nav>

        <div className="p-4 mb-4">
          <div className="bg-blue-500 p-4 rounded-xl shadow-md">
            <h3 className="text-white text-sm font-medium mb-2 hidden md:block">
              Need Help?
            </h3>
            <p className="text-blue-100 text-xs mb-3 hidden md:block">
              Contact our support team anytime
            </p>
            <button className="w-full bg-white text-blue-600 font-medium py-2 px-4 rounded-lg flex items-center justify-center">
              <span className="hidden md:inline">Support</span>
              <Bell className="h-5 w-5 md:hidden" />
            </button>
          </div>
        </div>

        <div className="p-4 mt-auto">
          <a
            href="#"
            className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-800 hover:bg-opacity-30 rounded-xl transition duration-150"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3 hidden md:block">Logout</span>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Driver Dashboard
              </h1>
              <p className="text-gray-500">Welcome back, John</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none relative"
                  onClick={markAllNotificationsAsRead}
                >
                  <Bell className="h-6 w-6" />
                  {hasNotifications && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center bg-gray-100 p-1 pl-3 rounded-full">
                <span className="text-sm font-medium text-gray-700 mr-2 hidden md:block">
                  John Driver
                </span>
                <img
                  className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                  src="/api/placeholder/100/100"
                  alt="Driver Profile"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="px-6 py-8">
          {/* Status Toggle */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-blue-600 relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-32 bg-blue-500 bg-opacity-10 transform rotate-12 translate-x-8"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Driver Status
                </h2>
                <p className="text-gray-600">
                  You are currently{" "}
                  <span
                    className={
                      isOnline ? "text-green-600 font-medium" : "text-gray-500"
                    }
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </p>
              </div>

              <div>
                <button
                  onClick={toggleOnlineStatus}
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-medium shadow-md transition-all duration-200 ${
                    isOnline
                      ? "bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500"
                      : "bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600"
                  }`}
                >
                  {isOnline ? "Go Offline" : "Go Online"}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-blue-100 text-sm font-medium">
                    Today&apos;s Earnings
                  </h3>
                  <p className="text-3xl font-bold mt-2">
                    ₹{earnings.toFixed(2)}
                  </p>
                  <span className="text-blue-100 text-sm flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    12% more than yesterday
                  </span>
                </div>
                <div className="p-3 rounded-full bg-blue-400 bg-opacity-30">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Completed Rides
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {completedRides}
                  </p>
                  <span className="text-green-500 text-sm flex items-center mt-2">
                    <Check className="h-4 w-4 mr-1" />
                    All rides rated 5 stars
                  </span>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Distance Traveled
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {totalDistance} <span className="text-lg">mi</span>
                  </p>
                  <span className="text-blue-600 text-sm flex items-center mt-2">
                    <Navigation className="h-4 w-4 mr-1" />
                    Today&apos;s activity
                  </span>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Car className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Earnings Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Weekly Earnings
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                View Details <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="h-64">
              <div className="flex items-end h-48 space-x-8 px-4">
                {weeklyEarnings.map((day, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className={`w-full rounded-t-lg ${
                        day.day === "Fri" ? "bg-blue-600" : "bg-blue-400"
                      }`}
                      style={{
                        height: `${(day.amount / maxEarning) * 100}%`,
                        minHeight: day.amount > 0 ? "10%" : "1%",
                      }}
                    ></div>
                    <p className="text-xs font-medium text-gray-600 mt-2">
                      {day.day}
                    </p>
                    <p
                      className={`text-xs ${
                        day.day === "Fri"
                          ? "font-bold text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      ₹{day.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map and Notifications Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Map Preview */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
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
                    <button className="text-sm text-blue-600 hover:text-blue-800 py-1 px-3 rounded-lg hover:bg-blue-50">
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-blue-600 mr-1" />
                  <span>
                    Current: New York City ({currentLocation.lat.toFixed(4)}°N,{" "}
                    {currentLocation.lng.toFixed(4)}°W)
                  </span>
                </div>
              </div>

              <div className="h-64 relative" ref={mapRef} style={{ zIndex: 0 }}>
                {/* The map will be rendered here */}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    Notifications
                  </h2>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800 py-1 px-3 rounded-lg hover:bg-blue-50"
                    onClick={markAllNotificationsAsRead}
                  >
                    Mark all as read
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition duration-150 ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex">
                        <div
                          className={`mt-1 mr-3 flex-shrink-0 ${
                            notification.urgent
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          {notification.urgent ? (
                            <Bell className="h-5 w-5" />
                          ) : (
                            <Bell className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              !notification.read
                                ? "font-medium text-gray-800"
                                : "text-gray-600"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 text-gray-400 mr-1" />
                            <p className="text-xs text-gray-500">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                      {!notification.read && (
                        <span className="bg-blue-600 h-2 w-2 rounded-full"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center">
                  View All Notifications{" "}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Rides */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Upcoming Rides
                </h2>
                <Link
                  to="/ride-requests"
                  className="text-sm text-blue-600 hover:text-blue-800 py-1 px-3 rounded-lg hover:bg-blue-50"
                >
                  View All
                </Link>
              </div>
            </div>

            <div>
              {upcomingRides.map((ride, index) => (
                <div
                  key={ride.id}
                  className={`p-6 ${
                    index !== upcomingRides.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  } hover:bg-gray-50 transition duration-150`}
                >
                  <div className="flex justify-between">
                    <div className="flex">
                      <div className="mr-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <Car className="h-6 w-6" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {ride.pickup} → {ride.dropoff}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{ride.time}</span>
                          <span className="mx-2">•</span>
                          <span>{ride.distance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{ride.fare}</p>
                      <button className="mt-2 px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {upcomingRides.length === 0 && (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full text-blue-600 mb-4">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No Upcoming Rides
                </h3>
                <p className="text-gray-500 mb-4">
                  You don&apos;t have any scheduled rides at the moment.
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                  Find Rides
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;
