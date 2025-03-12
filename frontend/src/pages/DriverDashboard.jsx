// import { useRef, useEffect, useState } from "react";
// import {
//   MapPin,
//   DollarSign,
//   Navigation,
//   Car,
//   ArrowUpRight,
//   User,
//   Power,
//   BellIcon,
// } from "lucide-react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { useDriverDashboardC } from "../context/DriverDashboardContext.";
// import { io } from "socket.io-client";
// import axios from "axios";
// import { server } from "../main";
// import { useDriver } from "../context/DriverContext";

// const DriverDashboard = () => {
//   // Use the driver dashboard context
//   const {
//     earnings,
//     totalDistance,
//     overallRating,
//     currentLocation,
//     isAvailable,
//     toggleAvailability,
//   } = useDriverDashboardC();

//   const { driver } = useDriver();
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const markerRef = useRef(null);
//   const [notifications, setNotifications] = useState([]);
//   const [socket, setSocket] = useState(null);

//   // Initialize the map
//   useEffect(() => {
//     if (mapRef.current && !mapInstanceRef.current) {
//       mapInstanceRef.current = L.map(mapRef.current).setView(
//         [currentLocation.lat, currentLocation.lng],
//         13
//       );

//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(mapInstanceRef.current);

//       const customIcon = L.divIcon({
//         className: "custom-div-icon",
//         html: `<div style="background-color: rgba(37, 99, 235, 0.2); width: 48px; height: 48px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
//                 <div style="background-color: rgba(37, 99, 235, 0.4); width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
//                   <div style="color: rgb(37, 99, 235); transform: translate(0, -4px);">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
//                   </div>
//                 </div>
//               </div>`,
//         iconSize: [48, 48],
//         iconAnchor: [24, 24],
//       });

//       markerRef.current = L.marker([currentLocation.lat, currentLocation.lng], {
//         icon: customIcon,
//       })
//         .addTo(mapInstanceRef.current)
//         .bindPopup("Your current location");

//       const zoomControl = L.control.zoom({
//         position: "topleft",
//       });
//       zoomControl.addTo(mapInstanceRef.current);

//       return () => {
//         if (mapInstanceRef.current) {
//           mapInstanceRef.current.remove();
//           mapInstanceRef.current = null;
//         }
//       };
//     }
//   }, [currentLocation]);

//   // Update the map marker and pan to the new location
//   useEffect(() => {
//     if (mapInstanceRef.current && markerRef.current) {
//       markerRef.current.setLatLng([currentLocation.lat, currentLocation.lng]);
//       mapInstanceRef.current.panTo([currentLocation.lat, currentLocation.lng]);
//     }
//   }, [currentLocation]);

//   useEffect(() => {
//     // Initialize WebSocket connection
//     const newSocket = io("http://localhost:5000");

//     setSocket(newSocket);

//     // Register driver with WebSocket server
//     const driver = sessionStorage.getItem("driver");
//     const d = JSON.parse(driver);
//     newSocket.emit("register-driver", d._id);

//     // Handle new ride requests
//     newSocket.on("new-ride-request", (data) => {
//       setNotifications((prev) => [data, ...prev]);
//       console.log("YE RAHI RIDE REQUEST");
//       console.log(data);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   const handleResponse = async (notificationId, response) => {
//     const d = sessionStorage.getItem("driver");
//     const driver = JSON.parse(d);
//     try {
//       const res = await axios.post(
//         `${server}/api/notifications/${notificationId}/${response}`,
//         driver
//       );
//       setNotifications((prev) => prev.filter((n) => n._id !== notificationId));

//       // Play sound notification
//       // if (typeof window !== "undefined") {
//       //   const audio = new Audio("/notification-sound.mp3");
//       //   audio.play();
//       // }
//     } catch (error) {
//       console.error("Error responding to ride:", error);
//     }
//   };

//   // Show loading state
//   // if (isLoading) {
//   //   return (
//   //     <div className="flex h-screen bg-gray-100 items-center justify-center">
//   //       <div className="text-xl font-bold text-gray-800">Loading...</div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <div className="flex-1 overflow-auto">
//         <main className="px-6 py-8">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-8">
//             <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={toggleAvailability}
//                 className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
//                   isAvailable
//                     ? "bg-green-500 text-white"
//                     : "bg-red-500 text-white"
//                 }`}
//               >
//                 <Power className="h-4 w-4 mr-2" />
//                 {isAvailable ? "Available" : "Unavailable"}
//               </button>
//               <a
//                 href="/profile-page"
//                 className="flex items-center px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium"
//               >
//                 <User className="h-4 w-4 mr-2" />
//                 Profile
//               </a>
//             </div>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {/* Daily Earnings */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h3 className="text-gray-500 text-sm font-medium">
//                     Daily Earnings
//                   </h3>
//                   <p className="text-3xl font-bold text-gray-800 mt-2">
//                     ₹{earnings.daily.toFixed(2)}
//                   </p>
//                   <span className="text-green-500 text-sm flex items-center mt-2">
//                     <ArrowUpRight className="h-4 w-4 mr-1" />
//                     12% more than yesterday
//                   </span>
//                 </div>
//                 <div className="p-3 rounded-full bg-blue-100 text-blue-600">
//                   <DollarSign className="h-6 w-6" />
//                 </div>
//               </div>
//             </div>

//             {/* Weekly Earnings */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h3 className="text-gray-500 text-sm font-medium">
//                     Weekly Earnings
//                   </h3>
//                   <p className="text-3xl font-bold text-gray-800 mt-2">
//                     ₹{earnings.weekly.toFixed(2)}
//                   </p>
//                 </div>
//                 <div className="p-3 rounded-full bg-blue-100 text-blue-600">
//                   <DollarSign className="h-6 w-6" />
//                 </div>
//               </div>
//             </div>

//             {/* Monthly Earnings */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h3 className="text-gray-500 text-sm font-medium">
//                     Monthly Earnings
//                   </h3>
//                   <p className="text-3xl font-bold text-gray-800 mt-2">
//                     ₹{earnings.monthly.toFixed(2)}
//                   </p>
//                 </div>
//                 <div className="p-3 rounded-full bg-blue-100 text-blue-600">
//                   <DollarSign className="h-6 w-6" />
//                 </div>
//               </div>
//             </div>

//             {/* Total Distance Covered */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h3 className="text-gray-500 text-sm font-medium">
//                     Total Distance
//                   </h3>
//                   <p className="text-3xl font-bold text-gray-800 mt-2">
//                     {totalDistance} <span className="text-lg">mi</span>
//                   </p>
//                 </div>
//                 <div className="p-3 rounded-full bg-blue-100 text-blue-600">
//                   <Car className="h-6 w-6" />
//                 </div>
//               </div>
//             </div>

//             {/* Overall Rating */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h3 className="text-gray-500 text-sm font-medium">
//                     Overall Rating
//                   </h3>
//                   <p className="text-3xl font-bold text-gray-800 mt-2">
//                     {overallRating}/5
//                   </p>
//                 </div>
//                 <div className="p-3 rounded-full bg-blue-100 text-blue-600">
//                   <Navigation className="h-6 w-6" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Map Preview */}
//           <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
//             <div className="p-6 pb-4">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold text-gray-800">
//                   Live Location
//                 </h2>
//                 <div className="flex items-center space-x-2">
//                   <span className="flex items-center text-sm text-gray-600">
//                     <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
//                     Live Tracking
//                   </span>
//                   <button className="text-sm text-blue-600 hover:text-blue-800 py-1 px-3 rounded-lg hover:bg-blue-50">
//                     Refresh
//                   </button>
//                 </div>
//               </div>
//               <div className="flex items-center mt-2 text-sm text-gray-600">
//                 <MapPin className="h-4 w-4 text-blue-600 mr-1" />
//                 <span>
//                   Current: New York City ({currentLocation.lat.toFixed(4)}°N,{" "}
//                   {currentLocation.lng.toFixed(4)}°W)
//                 </span>
//               </div>
//             </div>

//             <div className="h-64 relative" ref={mapRef} style={{ zIndex: 0 }}>
//               {/* The map will be rendered here */}
//             </div>
//           </div>
//           {/* Notifications */}
//           <div className="relative mr-4">
//             <button
//               onClick={() => setNotifications(!notifications)}
//               className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               <BellIcon className="w-5 h-5 mr-2" />
//               Notifications
//               {notifications.length > 0 && (
//                 <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
//                   {notifications.length}
//                 </span>
//               )}
//             </button>
//             {notifications && (
//               <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50">
//                 <div className="p-4 border-b border-gray-200">
//                   <h3 className="font-semibold text-lg">Ride Requests</h3>
//                 </div>
//                 <div className="max-h-96 overflow-y-auto">
//                   {notifications.map((notification) => (
//                     <div
//                       key={notification._id}
//                       className="p-4 border-b border-gray-100 hover:bg-gray-50"
//                     >
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-gray-900">
//                             {notification.message}
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             Fare: ₹{notification.ride.fare}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             Distance: {notification.ride.distance} km
//                           </p>
//                         </div>
//                         {notification.status === "pending" ? (
//                           <div className="flex gap-2 ml-4">
//                             <button
//                               onClick={() =>
//                                 handleResponse(notification._id, "accepted")
//                               }
//                               className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
//                             >
//                               Accept
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleResponse(notification._id, "rejected")
//                               }
//                               className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
//                             >
//                               Reject
//                             </button>
//                           </div>
//                         ) : (
//                           <span
//                             className={`text-sm ${
//                               notification.status === "accepted"
//                                 ? "text-green-500"
//                                 : "text-red-500"
//                             }`}
//                           >
//                             {notification.status}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DriverDashboard;

import { useRef, useEffect, useState } from "react";
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
import { useDriverDashboardC } from "../context/DriverDashboardContext.";
import { io } from "socket.io-client";
import axios from "axios";
import { server } from "../main";
import { useDriver } from "../context/DriverContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Fix for default marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

const DriverDashboard = () => {
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
  } = useDriverDashboardC();

  const { driver } = useDriver();
  const { currentLocation } = useDriverDashboardC();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // useEffect(() => {
  //   if (mapRef.current && !mapInstanceRef.current) {
  //     mapInstanceRef.current = L.map(mapRef.current, {
  //       zoomControl: false,
  //     }).setView([currentLocation.lat, currentLocation.lng], 14);

  //     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //       attribution:
  //         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //     }).addTo(mapInstanceRef.current);

  //     const customIcon = L.divIcon({
  //       className: "custom-div-icon",
  //       html: `<div style="background-color: rgba(37, 99, 235, 0.2); width: 48px; height: 48px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
  //               <div style="background-color: rgba(37, 99, 235, 0.4); width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
  //                 <div style="color: rgb(37, 99, 235); transform: translate(0, -4px);">
  //                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  //                 </div>
  //               </div>
  //             </div>`,
  //       iconSize: [48, 48],
  //       iconAnchor: [24, 24],
  //     });

  //     markerRef.current = L.marker([currentLocation.lat, currentLocation.lng], {
  //       icon: customIcon,
  //     })
  //       .addTo(mapInstanceRef.current)
  //       .bindPopup("Your current location");

  //     const zoomControl = L.control.zoom({
  //       position: "bottomright",
  //     });
  //     zoomControl.addTo(mapInstanceRef.current);

  //     return () => {
  //       if (mapInstanceRef.current) {
  //         mapInstanceRef.current.remove();
  //         mapInstanceRef.current = null;
  //       }
  //     };
  //   }
  // }, [currentLocation]);

  // //Update the map marker and pan to the new location
  // useEffect(() => {
  //   if (mapInstanceRef.current && markerRef.current) {
  //     markerRef.current.setLatLng([currentLocation.lat, currentLocation.lng]);
  //     mapInstanceRef.current.panTo([currentLocation.lat, currentLocation.lng]);
  //   }
  // }, [currentLocation]);

  useEffect(() => {
    const newSocket = io(`${server}`);

    setSocket(newSocket);

    // Register driver with WebSocket server
    const driverData = sessionStorage.getItem("driver");
    if (driverData) {
      const parsedDriver = JSON.parse(driverData);
      newSocket.emit("register-driver", parsedDriver._id);

      // Handle new ride requests
      newSocket.on("new-ride-request", (data) => {
        setNotifications((prev) => [data, ...prev]);

        // Play notification sound
        try {
          const audio = new Audio("../assets/notification-sound.mp3");
          audio.play();
        } catch (error) {
          console.error("Could not play notification sound", error);
        }

        // Show toast notification
        toast.info("New ride request received!", {
          position: "top-right",
          autoClose: 5000,
        });
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [currentLocation]);

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
        // Need the ride data from notification to pass to the ride page
        const acceptedNotification = notifications.find(
          (n) => n._id === notificationId
        );

        if (acceptedNotification) {
          navigate("/active-ride", {
            state: {
              ride: acceptedNotification.ride,
              driver: driver,
              otp: res.data.otp || "1234", // Fallback OTP
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Driver Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {driver?.name || "Driver"}
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

                {/* Notification dropdown */}
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
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                {/* Daily Earnings */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> Daily Earnings
                      </h3>
                      <p className="text-3xl font-bold text-gray-800 mt-2">
                        ₹{earnings.daily.toFixed(2)}
                      </p>
                      <span className="text-green-500 text-sm flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        12% more than yesterday
                      </span>
                    </div>
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Weekly Earnings */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> Weekly Earnings
                      </h3>
                      <p className="text-3xl font-bold text-gray-800 mt-2">
                        ₹{earnings.weekly.toFixed(2)}
                      </p>
                      <span className="text-green-500 text-sm flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        8% more than last week
                      </span>
                    </div>
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Monthly Earnings */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> Monthly Earnings
                      </h3>
                      <p className="text-3xl font-bold text-gray-800 mt-2">
                        ₹{earnings.monthly.toFixed(2)}
                      </p>
                      <span className="text-green-500 text-sm flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        5% more than last month
                      </span>
                    </div>
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Preview */}
              {/* <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100">
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
                      Current: {currentLocation.lat.toFixed(4)}°N,{" "}
                      {currentLocation.lng.toFixed(4)}°W
                    </span>
                  </div>
                </div>

                <div
                  className="h-[400px] relative"
                  ref={mapRef}
                  style={{ zIndex: 0 }}
                ></div>
              </div> */}

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
                          key={ride._id}
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-green-600 font-medium">
                              ₹{ride.fare}
                            </span>
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
                      {overallRating}/5
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Car className="h-4 w-4 mr-2 text-blue-500" /> Total
                      Distance
                    </span>
                    <span className="font-medium text-gray-900">
                      {totalDistance} km
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />{" "}
                      Completed Rides
                    </span>
                    <span className="font-medium text-gray-900">
                      {completedRides.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-2 text-red-500" />{" "}
                      Cancelled Rides
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
                    <TrendingUp className="h-4 w-4 mr-1" /> Today's Rides
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
