// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { server } from "../main";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   useMapEvents,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import AvailableDrivers from "./AvailableDrivers";
// import { Link, useNavigate } from "react-router-dom";
// import { UserData } from "../context/UserContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { io } from "socket.io-client";
// import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/20/solid";

// // Animation variants
// const fadeInUp = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 },
// };

// const center = [22.3072, 73.1812]; // Default center

// const geocodeLatLng = async (lat, lng) => {
//   const response = await fetch(
//     `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//   );
//   const data = await response.json();
//   if (data && data.display_name) {
//     return data.display_name;
//   }
//   return "";
// };

// const geocodeLocation = async (location) => {
//   const response = await fetch(
//     `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
//   );
//   const data = await response.json();
//   if (data && data.length > 0) {
//     return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
//   }
//   return null;
// };

// const fetchRoute = async (pickup, drop, setRoute) => {
//   const response = await fetch(
//     `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}?geometries=geojson`
//   );
//   const data = await response.json();
//   if (data && data.routes && data.routes[0] && data.routes[0].geometry) {
//     const route = data.routes[0].geometry.coordinates.map(([lng, lat]) => ({
//       lat,
//       lng,
//     }));
//     setRoute(route);
//     return {
//       route,
//       distance: data.routes[0].distance / 1000, // Convert meters to km
//       duration: data.routes[0].duration, // Duration in seconds
//     };
//   }
//   return null;
// };

// const MapEvents = ({ setMarkers, markers, setPickup, setDrop }) => {
//   useMapEvents({
//     click: async (e) => {
//       if (!markers.pickup) {
//         // Set the pickup location if not already set
//         const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
//         setPickup(locationName);
//         setMarkers((prev) => ({ ...prev, pickup: e.latlng }));
//       } else if (!markers.drop) {
//         // Set the drop location if not already set
//         const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
//         setDrop(locationName);
//         setMarkers((prev) => ({ ...prev, drop: e.latlng }));
//       } else {
//         // If both pickup and drop are set, update the drop location
//         const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
//         setDrop(locationName);
//         setMarkers((prev) => ({ ...prev, drop: e.latlng }));
//       }
//     },
//   });
//   return null;
// };

// const RideBookPage = () => {
//   const [pickup, setPickup] = useState("");
//   const [drop, setDrop] = useState("");
//   const [markers, setMarkers] = useState({ pickup: null, drop: null });
//   const [distance, setDistance] = useState(null);
//   const [duration, setDuration] = useState(null);
//   const [fare, setFare] = useState(null);
//   const [route, setRoute] = useState([]);
//   const [showDrivers, setShowDrivers] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const driversRef = useRef(null);
//   const [socket, setSocket] = useState(null);
//   const navigate = useNavigate();
//   const { user, isAuth } = UserData();
//   const { logout } = UserData();

//   const handleLogout = () => {
//     logout();
//   };
//   useEffect(() => {
//     if (markers.pickup && markers.drop) {
//       calculateRoute();
//     }
//   }, [markers]);

//   const calculateRoute = async () => {
//     if (!markers.pickup || !markers.drop) return;

//     try {
//       setLoading(true);
//       const routeData = await fetchRoute(
//         markers.pickup,
//         markers.drop,
//         setRoute
//       );

//       if (routeData) {
//         setDistance(routeData.distance.toFixed(2));
//         setDuration(routeData.duration);

//         // Calculate fare (basic algorithm)
//         const baseFare = 50;

//         const calculatedFare = Math.round(baseFare * routeData.distance);
//         setFare(calculatedFare);
//       } else {
//         // Fallback to direct distance calculation if route API fails
//         calculateDirectDistance(markers.pickup, markers.drop);
//       }
//     } catch (error) {
//       console.error("Failed to fetch route:", error);
//       calculateDirectDistance(markers.pickup, markers.drop);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateDirectDistance = (pickupLatLng, dropLatLng) => {
//     const R = 6371; // Radius of the Earth in km
//     const dLat = ((dropLatLng.lat - pickupLatLng.lat) * Math.PI) / 180;
//     const dLng = ((dropLatLng.lng - pickupLatLng.lng) * Math.PI) / 180;

//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((pickupLatLng.lat * Math.PI) / 180) *
//         Math.cos((dropLatLng.lat * Math.PI) / 180) *
//         Math.sin(dLng / 2) *
//         Math.sin(dLng / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distanceInKm = R * c;

//     setDistance(distanceInKm.toFixed(2));

//     // Estimate duration (assuming 30 km/h average speed)
//     const estimatedDuration = (distanceInKm / 30) * 3600; // in seconds
//     setDuration(Math.round(estimatedDuration));

//     const baseFare = 31.5;
//     const estimatedFare = Math.round(baseFare * distanceInKm);
//     setFare(estimatedFare);
//   };

//   const handleBookCab = () => {
//     if (!pickup) {
//       toast.error("Please select pickup location");
//       return;
//     }

//     if (!drop) {
//       toast.error("Please select drop location");
//       return;
//     }

//     if (!distance) {
//       toast.error("Unable to calculate route distance");
//       return;
//     }

//     setShowDrivers(true);

//     setTimeout(() => {
//       if (driversRef.current) {
//         driversRef.current.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//       }
//     }, 100);
//   };

//   const handleConfirmBooking = async (driver) => {
//     try {
//       setLoading(true);

//       // Prepare ride data
//       const rideData = {
//         riderId: user._id,
//         driverId: driver._id._id,
//         pickup: {
//           address: pickup,
//           coordinates: {
//             type: "Point",
//             coordinates: [markers.pickup.lng, markers.pickup.lat],
//           },
//         },
//         drop: {
//           address: drop,
//           coordinates: {
//             type: "Point",
//             coordinates: [markers.drop.lng, markers.drop.lat],
//           },
//         },

//         distance: parseFloat(distance),
//         fare: fare,
//         duration: duration,
//         rideType: "standard",
//         ridername: user.name,
//       };
//       const response = await axios.post(`${server}/api/ride/request`, rideData);
//       if (response.status === 201) {
//         toast.success("Ride booked successfully! Waiting for driver response.");
//         navigate("/ride-waiting", {
//           state: { ride: response.data.ride },
//         });
//       }
//     } catch (error) {
//       console.error("Error booking ride:", error);
//       toast.error(error.response?.data?.message || "Failed to book ride");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setPickupToCurrentLocation = async () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude, longitude } = position.coords;
//         const locationName = await geocodeLatLng(latitude, longitude);
//         setPickup(locationName);
//         setMarkers((prev) => ({
//           ...prev,
//           pickup: { lat: latitude, lng: longitude },
//         }));
//       });
//     } else {
//       toast.error("Geolocation is not supported by your browser.");
//     }
//   };

//   const handleLocationChange = async (value, type) => {
//     if (type === "pickup") {
//       setPickup(value);
//       if (value.trim().length > 3) {
//         const latLng = await geocodeLocation(value);
//         if (latLng) {
//           setMarkers((prev) => ({ ...prev, pickup: latLng }));
//         }
//       }
//     } else if (type === "drop") {
//       setDrop(value);
//       if (value.trim().length > 3) {
//         const latLng = await geocodeLocation(value);
//         if (latLng) {
//           setMarkers((prev) => ({ ...prev, drop: latLng }));
//         }
//       }
//     }
//   };

//   const clearMarkers = () => {
//     setMarkers({ pickup: null, drop: null });
//     setPickup("");
//     setDrop("");
//     setDistance(null);
//     setDuration(null);
//     setFare(null);
//     setRoute([]);
//   };

//   const swapLocations = () => {
//     const tempPickup = pickup;
//     const tempPickupMarker = markers.pickup;
//     setPickup(drop);
//     setMarkers((prev) => ({
//       ...prev,
//       pickup: prev.drop,
//       drop: tempPickupMarker,
//     }));
//     setDrop(tempPickup);
//   };

//   const blueIcon = new L.Icon({
//     iconUrl:
//       "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
//     shadowUrl:
//       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41],
//   });
//   const handleMarkerDrag = (e, type) => {
//     const newLatLng = e.target.getLatLng();
//     if (type === "pickup") {
//       setMarkers((prev) => ({
//         ...prev,
//         pickup: { lat: newLatLng.lat, lng: newLatLng.lng },
//       }));
//       geocodeLatLng(newLatLng.lat, newLatLng.lng).then(setPickup);
//     } else if (type === "drop") {
//       setMarkers((prev) => ({
//         ...prev,
//         drop: { lat: newLatLng.lat, lng: newLatLng.lng },
//       }));
//       geocodeLatLng(newLatLng.lat, newLatLng.lng).then(setDrop);
//     }
//   };

//   if (!isAuth) {
//     navigate("/login");
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//       {/* Header */}
//       <motion.header
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-50"
//       >
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <Link
//               to="/"
//               className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
//             >
//               CabNest
//             </Link>

//             <div className="flex items-center gap-4">
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full hover:bg-blue-200 transition-colors"
//               >
//                 <span className="text-white">Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </motion.header>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="container mx-auto px-6 py-12"
//       >
//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Form Section */}
//           <motion.div
//             variants={fadeInUp}
//             className="bg-white rounded-2xl shadow-xl p-8"
//           >
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
//               Plan Your Journey
//             </h2>

//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Pickup Location
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={pickup}
//                     onChange={(e) =>
//                       handleLocationChange(e.target.value, "pickup")
//                     }
//                     className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter pickup location"
//                   />
//                   <button
//                     onClick={setPickupToCurrentLocation}
//                     className="px-4 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
//                     title="Use Current Location"
//                   >
//                     📍
//                   </button>
//                 </div>
//               </div>

//               <button
//                 onClick={swapLocations}
//                 className="mx-auto flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
//               >
//                 ⇅
//               </button>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Drop Location
//                 </label>
//                 <input
//                   type="text"
//                   value={drop}
//                   onChange={(e) => handleLocationChange(e.target.value, "drop")}
//                   className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter drop location"
//                 />
//               </div>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="space-y-4 bg-gray-50 p-6 rounded-xl"
//               >
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Distance:</span>
//                   <span className="font-medium">
//                     {distance ? `${distance} km` : "-"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Duration:</span>
//                   <span className="font-medium">
//                     {duration ? `${Math.floor(duration / 60)} min` : "-"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Estimated Fare:</span>
//                   <span className="font-medium text-blue-600">
//                     {fare ? `₹${fare}` : "-"}
//                   </span>
//                 </div>
//               </motion.div>

//               <div className="flex gap-4 justify-end">
//                 <button
//                   onClick={clearMarkers}
//                   className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
//                 >
//                   Clear
//                 </button>
//                 <button
//                   onClick={handleBookCab}
//                   className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
//                   disabled={loading || !distance}
//                 >
//                   {loading ? (
//                     <span className="flex items-center gap-2">
//                       <span className="animate-spin">🌀</span> Searching...
//                     </span>
//                   ) : (
//                     "Find Rides"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </motion.div>

//           {/* Map Section */}
//           <motion.div
//             variants={fadeInUp}
//             className="bg-white rounded-2xl shadow-xl overflow-hidden"
//           >
//             <div className="h-[600px]">
//               <MapContainer
//                 center={center}
//                 zoom={12}
//                 className="h-full w-full rounded-2xl"
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 />
//                 <MapEvents
//                   setMarkers={setMarkers}
//                   markers={markers}
//                   setPickup={setPickup}
//                   setDrop={setDrop}
//                 />
//                 {markers.pickup && (
//                   <Marker
//                     position={markers.pickup}
//                     icon={blueIcon}
//                     draggable={true}
//                     eventHandlers={{
//                       dragend: (e) => handleMarkerDrag(e, "pickup"),
//                     }}
//                   >
//                     <Popup className="text-sm font-medium">{pickup}</Popup>
//                   </Marker>
//                 )}
//                 {markers.drop && (
//                   <Marker
//                     position={markers.drop}
//                     icon={blueIcon}
//                     draggable={true}
//                     eventHandlers={{
//                       dragend: (e) => handleMarkerDrag(e, "drop"),
//                     }}
//                   >
//                     <Popup className="text-sm font-medium">{drop}</Popup>
//                   </Marker>
//                 )}
//                 {route.length > 0 && (
//                   <Polyline
//                     positions={route.map((point) => [point.lat, point.lng])}
//                     color="#4F46E5"
//                     weight={3}
//                   />
//                 )}
//               </MapContainer>
//             </div>
//           </motion.div>
//         </div>

//         {/* Drivers Section */}
//         <AnimatePresence>
//           {showDrivers && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 20 }}
//               className="mt-12"
//               ref={driversRef}
//             >
//               <AvailableDrivers
//                 distance={distance}
//                 duration={duration}
//                 fare={fare}
//                 pickup={markers.pickup}
//                 drop={markers.drop}
//                 onClose={() => setShowDrivers(false)}
//                 onBook={handleConfirmBooking}
//               />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>

//       <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
//         <div className="container mx-auto px-6 text-center">
//           <p className="text-sm">
//             © {new Date().getFullYear()} CabNest. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default RideBookPage;
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { server } from "../main";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AvailableDrivers from "./AvailableDrivers";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/20/solid";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const center = [22.3072, 73.1812]; // Default center

const geocodeLatLng = async (lat, lng) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
  const data = await response.json();
  if (data && data.display_name) {
    return data.display_name;
  }
  return "";
};

const geocodeLocation = async (location) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
  );
  const data = await response.json();
  if (data && data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
};

const fetchRoute = async (pickup, drop, setRoute) => {
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}?geometries=geojson`
  );
  const data = await response.json();
  if (data && data.routes && data.routes[0] && data.routes[0].geometry) {
    const route = data.routes[0].geometry.coordinates.map(([lng, lat]) => ({
      lat,
      lng,
    }));
    setRoute(route);
    return {
      route,
      distance: data.routes[0].distance / 1000, // Convert meters to km
      duration: data.routes[0].duration, // Duration in seconds
    };
  }
  return null;
};

const MapEvents = ({ setMarkers, markers, setPickup, setDrop }) => {
  useMapEvents({
    click: async (e) => {
      if (!markers.pickup) {
        // Set the pickup location if not already set
        const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
        setPickup(locationName);
        setMarkers((prev) => ({ ...prev, pickup: e.latlng }));
      } else if (!markers.drop) {
        // Set the drop location if not already set
        const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
        setDrop(locationName);
        setMarkers((prev) => ({ ...prev, drop: e.latlng }));
      } else {
        // If both pickup and drop are set, update the drop location
        const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
        setDrop(locationName);
        setMarkers((prev) => ({ ...prev, drop: e.latlng }));
      }
    },
  });
  return null;
};

const RideBookPage = (user1) => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [markers, setMarkers] = useState({ pickup: null, drop: null });
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [fare, setFare] = useState(null);
  const [route, setRoute] = useState([]);
  const [showDrivers, setShowDrivers] = useState(false);
  const [loading, setLoading] = useState(false);
  const driversRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const { user, isAuth, userId } = UserData();
  const { logout } = UserData();

  const handleLogout = () => {
    logout();
  };
  useEffect(() => {
    if (markers.pickup && markers.drop) {
      calculateRoute();
    }
  }, [markers]);
  // console.log(user._id);
  const calculateRoute = async () => {
    if (!markers.pickup || !markers.drop) return;

    try {
      setLoading(true);
      const routeData = await fetchRoute(
        markers.pickup,
        markers.drop,
        setRoute
      );

      if (routeData) {
        setDistance(routeData.distance.toFixed(2));
        setDuration(routeData.duration);

        // Calculate fare (basic algorithm)
        const baseFare = 50;

        const calculatedFare = Math.round(baseFare * routeData.distance);
        setFare(calculatedFare);
      } else {
        // Fallback to direct distance calculation if route API fails
        calculateDirectDistance(markers.pickup, markers.drop);
      }
    } catch (error) {
      console.error("Failed to fetch route:", error);
      calculateDirectDistance(markers.pickup, markers.drop);
    } finally {
      setLoading(false);
    }
  };

  const calculateDirectDistance = (pickupLatLng, dropLatLng) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((dropLatLng.lat - pickupLatLng.lat) * Math.PI) / 180;
    const dLng = ((dropLatLng.lng - pickupLatLng.lng) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pickupLatLng.lat * Math.PI) / 180) *
        Math.cos((dropLatLng.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInKm = R * c;

    setDistance(distanceInKm.toFixed(2));

    // Estimate duration (assuming 30 km/h average speed)
    const estimatedDuration = (distanceInKm / 30) * 3600; // in seconds
    setDuration(Math.round(estimatedDuration));

    const baseFare = 31.5;
    const estimatedFare = Math.round(baseFare * distanceInKm);
    setFare(estimatedFare);
  };

  const handleBookCab = () => {
    if (!pickup) {
      toast.error("Please select pickup location");
      return;
    }

    if (!drop) {
      toast.error("Please select drop location");
      return;
    }

    if (!distance) {
      toast.error("Unable to calculate route distance");
      return;
    }

    setShowDrivers(true);

    setTimeout(() => {
      if (driversRef.current) {
        driversRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleConfirmBooking = async (driver) => {
    try {
      setLoading(true);
      // Prepare ride data
      const rideData = {
        riderId: userId || user._id,
        driverId: driver._id._id,
        pickup: {
          address: pickup,
          coordinates: {
            type: "Point",
            coordinates: [markers.pickup.lng, markers.pickup.lat],
          },
        },
        drop: {
          address: drop,
          coordinates: {
            type: "Point",
            coordinates: [markers.drop.lng, markers.drop.lat],
          },
        },

        distance: parseFloat(distance),
        fare: fare,
        duration: duration,
        rideType: "standard",
        ridername: user.name,
      };
      const response = await axios.post(`${server}/api/ride/request`, rideData);
      if (response.status === 201) {
        toast.success("Ride booked successfully! Waiting for driver response.");
        navigate("/ride-waiting", {
          state: { ride: response.data.ride },
        });
      }
    } catch (error) {
      console.error("Error booking ride:", error);
      toast.error(error.response?.data?.message || "Failed to book ride");
    } finally {
      setLoading(false);
    }
  };

  const setPickupToCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const locationName = await geocodeLatLng(latitude, longitude);
        setPickup(locationName);
        setMarkers((prev) => ({
          ...prev,
          pickup: { lat: latitude, lng: longitude },
        }));
      });
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handleLocationChange = async (value, type) => {
    if (type === "pickup") {
      setPickup(value);
      if (value.trim().length > 3) {
        const latLng = await geocodeLocation(value);
        if (latLng) {
          setMarkers((prev) => ({ ...prev, pickup: latLng }));
        }
      }
    } else if (type === "drop") {
      setDrop(value);
      if (value.trim().length > 3) {
        const latLng = await geocodeLocation(value);
        if (latLng) {
          setMarkers((prev) => ({ ...prev, drop: latLng }));
        }
      }
    }
  };

  const clearMarkers = () => {
    setMarkers({ pickup: null, drop: null });
    setPickup("");
    setDrop("");
    setDistance(null);
    setDuration(null);
    setFare(null);
    setRoute([]);
  };

  const swapLocations = () => {
    const tempPickup = pickup;
    const tempPickupMarker = markers.pickup;
    setPickup(drop);
    setMarkers((prev) => ({
      ...prev,
      pickup: prev.drop,
      drop: tempPickupMarker,
    }));
    setDrop(tempPickup);
  };

  const blueIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  const handleMarkerDrag = (e, type) => {
    const newLatLng = e.target.getLatLng();
    if (type === "pickup") {
      setMarkers((prev) => ({
        ...prev,
        pickup: { lat: newLatLng.lat, lng: newLatLng.lng },
      }));
      geocodeLatLng(newLatLng.lat, newLatLng.lng).then(setPickup);
    } else if (type === "drop") {
      setMarkers((prev) => ({
        ...prev,
        drop: { lat: newLatLng.lat, lng: newLatLng.lng },
      }));
      geocodeLatLng(newLatLng.lat, newLatLng.lng).then(setDrop);
    }
  };

  if (!isAuth) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              CabNest
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full hover:bg-blue-200 transition-colors"
              >
                <span className="text-white">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
              Plan Your Journey
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) =>
                      handleLocationChange(e.target.value, "pickup")
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter pickup location"
                  />
                  <button
                    onClick={setPickupToCurrentLocation}
                    className="px-4 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                    title="Use Current Location"
                  >
                    📍
                  </button>
                </div>
              </div>

              <button
                onClick={swapLocations}
                className="mx-auto flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
              >
                ⇅
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drop Location
                </label>
                <input
                  type="text"
                  value={drop}
                  onChange={(e) => handleLocationChange(e.target.value, "drop")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter drop location"
                />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 bg-gray-50 p-6 rounded-xl"
              >
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">
                    {distance ? `${distance} km` : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {duration ? `${Math.floor(duration / 60)} min` : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Fare:</span>
                  <span className="font-medium text-blue-600">
                    {fare ? `₹${fare}` : "-"}
                  </span>
                </div>
              </motion.div>

              <div className="flex gap-4 justify-end">
                <button
                  onClick={clearMarkers}
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleBookCab}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                  disabled={loading || !distance}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">🌀</span> Searching...
                    </span>
                  ) : (
                    "Find Rides"
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Map Section */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="h-[600px]">
              <MapContainer
                center={center}
                zoom={12}
                className="h-full w-full rounded-2xl"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapEvents
                  setMarkers={setMarkers}
                  markers={markers}
                  setPickup={setPickup}
                  setDrop={setDrop}
                />
                {markers.pickup && (
                  <Marker
                    position={markers.pickup}
                    icon={blueIcon}
                    draggable={true}
                    eventHandlers={{
                      dragend: (e) => handleMarkerDrag(e, "pickup"),
                    }}
                  >
                    <Popup className="text-sm font-medium">{pickup}</Popup>
                  </Marker>
                )}
                {markers.drop && (
                  <Marker
                    position={markers.drop}
                    icon={blueIcon}
                    draggable={true}
                    eventHandlers={{
                      dragend: (e) => handleMarkerDrag(e, "drop"),
                    }}
                  >
                    <Popup className="text-sm font-medium">{drop}</Popup>
                  </Marker>
                )}
                {route.length > 0 && (
                  <Polyline
                    positions={route.map((point) => [point.lat, point.lng])}
                    color="#4F46E5"
                    weight={3}
                  />
                )}
              </MapContainer>
            </div>
          </motion.div>
        </div>

        {/* Drivers Section */}
        <AnimatePresence>
          {showDrivers && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-12"
              ref={driversRef}
            >
              <AvailableDrivers
                distance={distance}
                duration={duration}
                fare={fare}
                pickup={markers.pickup}
                drop={markers.drop}
                onClose={() => setShowDrivers(false)}
                onBook={handleConfirmBooking}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} CabNest. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RideBookPage;
