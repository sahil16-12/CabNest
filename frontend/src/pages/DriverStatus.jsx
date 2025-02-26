// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
// import L from "leaflet";
// import { useLocation, useNavigate } from "react-router-dom";

// // 📍 Custom Icons (Crazy looking)
// const riderIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [40, 40],
// });

// const driverIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448610.png",
//   iconSize: [50, 50],
// });

// // 📌 Generate random coordinates within a 5km radius
// const getRandomLocation = (lat, lng) => {
//   const radius = 5000; // 5km
//   const y0 = lat;
//   const x0 = lng;
//   const rd = radius / 111300; // Convert meters to degrees

//   const u = Math.random();
//   const v = Math.random();
//   const w = rd * Math.sqrt(u);
//   const t = 2 * Math.PI * v;
//   const x = w * Math.cos(t);
//   const y = w * Math.sin(t);

//   return [y0 + y, x0 + x];
// };

// const DriverStatus = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const { pickup, drop } = state.ride;
//   console.log(pickup + " " + drop);
//   // 📍 Driver's starting position (random within 5km of pickup)
//   const [driverPos, setDriverPos] = useState(
//     getRandomLocation(pickup.lat, pickup.lng)
//   );
//   const [phase, setPhase] = useState("toPickup"); // "toPickup" → "rideStarted"
//   const [rideStarted, setRideStarted] = useState(false);

//   // 📌 Move the driver every 2 sec towards destination
//   useEffect(() => {
//     console.log("Pickup and drop locations are : " + state.ride);
//     if (!rideStarted) {
//       const interval = setInterval(() => moveDriver(pickup), 2000);
//       return () => clearInterval(interval);
//     } else {
//       const interval = setInterval(() => moveDriver(drop), 2000);
//       return () => clearInterval(interval);
//     }
//   }, [rideStarted]);

//   // 🚗 Move driver towards a target (pickup/drop)
//   const moveDriver = (target) => {
//     const speed = 0.0008; // Adjust speed
//     const [lat, lng] = driverPos;
//     const newLat = lat + (target.lat - lat) * speed;
//     const newLng = lng + (target.lng - lng) * speed;

//     setDriverPos([newLat, newLng]);

//     // ✅ If driver reaches pickup/drop, stop moving
//     if (
//       Math.abs(newLat - target.lat) < 0.0005 &&
//       Math.abs(newLng - target.lng) < 0.0005
//     ) {
//       if (phase === "toPickup") {
//         setPhase("waitingForStart");
//       } else if (phase === "rideStarted") {
//         alert("Ride Completed! 🎉");
//         navigate("/driver/dashboard");
//       }
//     }
//   };

//   return (
//     <div className="h-screen w-full flex flex-col items-center bg-gray-100 p-4">
//       <h1 className="text-3xl font-bold text-gray-800 mb-4">
//         🚕 Live Ride Tracking
//       </h1>

//       <MapContainer
//         center={pickup}
//         zoom={14}
//         className="w-full h-3/4 rounded-lg shadow-md"
//       >
//         {/* 🗺️ Map Tiles */}
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {/* 📍 Pickup Marker */}
//         <Marker position={pickup} icon={riderIcon}></Marker>

//         {/* 📍 Drop Marker */}
//         <Marker position={drop} icon={riderIcon}></Marker>

//         {/* 🚖 Driver Marker */}
//         <Marker position={driverPos} icon={driverIcon}></Marker>

//         {/* 📌 Route from Driver to Pickup */}
//         {phase === "toPickup" && (
//           <Polyline positions={[driverPos, pickup]} color="blue" />
//         )}

//         {/* 📌 Route from Pickup to Drop */}
//         {rideStarted && <Polyline positions={[pickup, drop]} color="red" />}
//       </MapContainer>

//       {/* 🚀 Ride Control Buttons */}
//       {phase === "waitingForStart" && (
//         <button
//           className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600"
//           onClick={() => {
//             setRideStarted(true);
//             setPhase("rideStarted");
//           }}
//         >
//           🚀 Start Ride
//         </button>
//       )}
//     </div>
//   );
// };

// export default DriverStatus;

// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
// import L from "leaflet";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";

// // 📍 Custom Icons
// const riderIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [40, 40],
// });

// const driverIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448610.png",
//   iconSize: [50, 50],
// });

// // 📌 Generate a random location within a 5km radius
// const getRandomLocation = (lat, lng) => {
//   const radius = 5000; // 5km
//   const y0 = lat;
//   const x0 = lng;
//   const rd = radius / 111300; // Convert meters to degrees

//   const u = Math.random();
//   const v = Math.random();
//   const w = rd * Math.sqrt(u);
//   const t = 2 * Math.PI * v;
//   const x = w * Math.cos(t);
//   const y = w * Math.sin(t);

//   return [y0 + y, x0 + x];
// };

// // 📌 Function to fetch lat/lng from location string
// const getCoordinates = async (locationName) => {
//   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//     locationName
//   )}`;
//   try {
//     const response = await axios.get(url);
//     if (response.data.length > 0) {
//       return {
//         lat: parseFloat(response.data[0].lat),
//         lng: parseFloat(response.data[0].lon),
//       };
//     }
//     return null;
//   } catch (error) {
//     console.error("Error fetching coordinates:", error);
//     return null;
//   }
// };

// const DriverStatus = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const { pickup: pickupName, drop: dropName } = state.ride;

//   const [pickup, setPickup] = useState(null);
//   const [drop, setDrop] = useState(null);
//   const [driverPos, setDriverPos] = useState(null);
//   const [phase, setPhase] = useState("fetching"); // "fetching", "toPickup", "waitingForStart", "rideStarted"
//   const [rideStarted, setRideStarted] = useState(false);

//   // 📌 Convert location names to lat/lng on mount
//   useEffect(() => {
//     const fetchLocations = async () => {
//       const pickupCoords = await getCoordinates(pickupName);
//       const dropCoords = await getCoordinates(dropName);

//       if (pickupCoords && dropCoords) {
//         setPickup(pickupCoords);
//         setDrop(dropCoords);
//         setDriverPos(getRandomLocation(pickupCoords.lat, pickupCoords.lng)); // Random driver start location
//         setPhase("toPickup"); // Move to pickup
//       } else {
//         alert("Error: Could not fetch location coordinates");
//         navigate(-1);
//       }
//     };

//     fetchLocations();
//   }, [pickupName, dropName, navigate]);

//   // 📌 Move the driver towards a target location
//   useEffect(() => {
//     if (!pickup || !drop || !driverPos) return;

//     const moveDriver = (target) => {
//       const speed = 0.0008; // Adjust speed for smooth movement
//       const [lat, lng] = driverPos;
//       const newLat = lat + (target.lat - lat) * speed;
//       const newLng = lng + (target.lng - lng) * speed;

//       setDriverPos([newLat, newLng]);

//       // ✅ If driver reaches the target, stop moving
//       if (
//         Math.abs(newLat - target.lat) < 0.0005 &&
//         Math.abs(newLng - target.lng) < 0.0005
//       ) {
//         if (phase === "toPickup") {
//           setPhase("waitingForStart");
//         } else if (phase === "rideStarted") {
//           alert("🎉 Ride Completed!");
//           navigate("/driver/dashboard");
//         }
//       }
//     };

//     const interval = setInterval(() => {
//       moveDriver(rideStarted ? drop : pickup);
//     }, 2000);

//     return () => clearInterval(interval);
//   }, [rideStarted, pickup, drop, driverPos, phase, navigate]);

//   if (phase === "fetching") {
//     return (
//       <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-100">
//         <h1 className="text-2xl font-bold text-gray-700">
//           Fetching Ride Data... ⏳
//         </h1>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen w-full flex flex-col items-center bg-gray-100 p-4">
//       <h1 className="text-3xl font-bold text-gray-800 mb-4">
//         🚕 Live Ride Tracking
//       </h1>

//       <MapContainer
//         center={pickup}
//         zoom={14}
//         className="w-full h-3/4 rounded-lg shadow-md"
//       >
//         {/* 🗺️ Map Tiles */}
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {/* 📍 Pickup Marker */}
//         <Marker position={pickup} icon={riderIcon}></Marker>

//         {/* 📍 Drop Marker */}
//         <Marker position={drop} icon={riderIcon}></Marker>

//         {/* 🚖 Driver Marker */}
//         <Marker position={driverPos} icon={driverIcon}></Marker>

//         {/* 📌 Route from Driver to Pickup */}
//         {phase === "toPickup" && (
//           <Polyline positions={[driverPos, pickup]} color="blue" />
//         )}

//         {/* 📌 Route from Pickup to Drop */}
//         {rideStarted && <Polyline positions={[pickup, drop]} color="red" />}
//       </MapContainer>

//       {/* 🚀 Ride Control Buttons */}
//       {phase === "waitingForStart" && (
//         <button
//           className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600"
//           onClick={() => {
//             setRideStarted(true);
//             setPhase("rideStarted");
//           }}
//         >
//           🚀 Start Ride
//         </button>
//       )}
//     </div>
//   );
// };

// export default DriverStatus;

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { motion } from "framer-motion";

// Custom icons
const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3076/3076134.png",
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

const riderIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3130/3130315.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const OSRM_API_URL = "https://router.project-osrm.org/route/v1/driving/";

const generateNearbyCoords = (center, radius = 0.01) => [
  center[0] + (Math.random() - 0.5) * radius,
  center[1] + (Math.random() - 0.5) * radius,
];

const DriverMarker = ({ position }) => {
  const markerRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    if (markerRef.current && position) {
      markerRef.current.setLatLng(position);
    }
  }, [position]);

  return position ? (
    <Marker
      position={position}
      icon={driverIcon}
      ref={(ref) => {
        markerRef.current = ref;
        if (ref && position) ref.setLatLng(position);
      }}
    >
      <Popup>Your Vehicle</Popup>
    </Marker>
  ) : null;
};

const DriverStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickup, drop } = location.state.ride || {};

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [riderCoords, setRiderCoords] = useState(null);
  const [driverCoords, setDriverCoords] = useState(null);
  const [route, setRoute] = useState([]);
  const [status, setStatus] = useState("Finding rider...");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const movementInterval = useRef(null);

  const statusMessages = {
    searching: "🚗 Connecting to Rider...",
    enroutePickup: "➡️ Heading to Pickup Location",
    arrivedPickup: "✅ Reached Pickup Point",
    enrouteDrop: "📦 Taking Rider to Destination",
    completed: "🎉 Ride Completed!",
  };

  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      return response.data[0]
        ? [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)]
        : null;
    } catch (error) {
      setError("Location search failed");
      return null;
    }
  };

  const fetchRoute = async (start, end) => {
    try {
      const response = await axios.get(
        `${OSRM_API_URL}${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      );
      return response.data.routes?.[0]?.geometry?.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );
    } catch (error) {
      setError("Route calculation failed");
      return null;
    }
  };

  useEffect(() => {
    const initializeRide = async () => {
      if (!pickup || !drop) return navigate("/");

      try {
        const pickupLocation = await fetchCoordinates(pickup);
        const dropLocation = await fetchCoordinates(drop);

        if (!pickupLocation || !dropLocation) return;

        // Generate random positions
        const riderPosition = generateNearbyCoords(pickupLocation);
        const driverPosition = generateNearbyCoords(pickupLocation, 0.1);

        setPickupCoords(pickupLocation);
        setDropCoords(dropLocation);
        setRiderCoords(riderPosition);
        setDriverCoords(driverPosition);

        // First route: Driver to Rider
        const toPickupRoute = await fetchRoute(driverPosition, riderPosition);
        if (!toPickupRoute) return;

        setRoute(toPickupRoute);
        startMovement(toPickupRoute, statusMessages.enroutePickup, async () => {
          setStatus(statusMessages.arrivedPickup);
          // Second route: Rider to Drop
          const toDropRoute = await fetchRoute(riderPosition, dropLocation);
          if (toDropRoute) setRoute(toDropRoute);
        });
      } catch (error) {
        setError("Ride initialization failed");
      }
    };

    initializeRide();
    return () => clearInterval(movementInterval.current);
  }, []);

  const startMovement = (path, statusMessage, onComplete) => {
    clearInterval(movementInterval.current);
    setStatus(statusMessage);
    let currentStep = 0;

    movementInterval.current = setInterval(() => {
      if (currentStep >= path.length) {
        clearInterval(movementInterval.current);
        onComplete?.();
        return;
      }

      setDriverCoords(path[currentStep]);
      setProgress((currentStep / path.length) * 100);
      currentStep++;
    }, 150);
  };

  const startRide = () => {
    setStatus(statusMessages.enrouteDrop);
    startMovement(route, statusMessages.enrouteDrop, () => {
      setStatus(statusMessages.completed);
    });
  };

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!driverCoords || !pickupCoords) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-pulse text-2xl text-gray-600">
          <div className="flex items-center gap-2">
            <div className="animate-spin">🚕</div>
            Initializing Ride...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-blue-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-blue-600">{status.split(" ")[0]}</span>
                {status.split(" ").slice(1).join(" ")}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {
                  statusMessages[
                    status.includes("Pickup") ? "enroutePickup" : "enrouteDrop"
                  ]
                }
              </p>
            </div>
            <div className="text-right">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚕</span>
              </div>
            </div>
          </div>

          <div className="relative pt-2">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>

        <div className="h-96 rounded-2xl overflow-hidden shadow-xl border-2 border-white">
          <MapContainer
            center={pickupCoords}
            zoom={13}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {pickupCoords && (
              <Marker position={pickupCoords}>
                <Popup>Pickup Location</Popup>
              </Marker>
            )}

            {dropCoords && (
              <Marker position={dropCoords}>
                <Popup>Destination</Popup>
              </Marker>
            )}

            {riderCoords && (
              <Marker position={riderCoords} icon={riderIcon}>
                <Popup>Rider Waiting</Popup>
              </Marker>
            )}

            <DriverMarker position={driverCoords} />
            <Polyline positions={route} color="#3B82F6" weight={4} />
          </MapContainer>
        </div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mt-6 border-2 border-blue-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Rider Details</h3>
              <p className="text-gray-600">Name: John Doe</p>
              <p className="text-gray-600">Rating: ⭐⭐⭐⭐ (4.8)</p>
            </div>
            {status === statusMessages.arrivedPickup && (
              <button
                onClick={startRide}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold 
                  transform transition-all hover:scale-105 shadow-md"
              >
                Start Ride ➡️
              </button>
            )}
            {status === statusMessages.completed && (
              <button
                onClick={() => navigate("/ride-completed")}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-bold 
                  transform transition-all hover:scale-105 shadow-md"
              >
                Finish Ride ✅
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DriverStatus;
