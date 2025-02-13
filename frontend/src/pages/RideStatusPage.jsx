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

// Custom car icon
const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744515.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const OSRM_API_URL = "https://router.project-osrm.org/route/v1/driving/";

const generateFartherCoords = (center, radius = 0.1) => [
  center[0] + (Math.random() - 0.5) * radius,
  center[1] + (Math.random() - 0.5) * radius,
];

const DriverMarker = ({ position }) => {
  const markerRef = useRef(null);
  const map = useMap();

  // Smooth marker update without map centering
  useEffect(() => {
    if (markerRef.current && position) {
      markerRef.current.setLatLng(position);
    }
  }, [position]);

  return position ? (
    <Marker
      position={position}
      icon={carIcon}
      ref={(ref) => {
        markerRef.current = ref;
        if (ref && position) ref.setLatLng(position);
      }}
    >
      <Popup>Driver is here!</Popup>
    </Marker>
  ) : null;
};

const RideStatusPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickup, drop } = location.state || {};

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [driver, setDriver] = useState(null);
  const [route, setRoute] = useState([]);
  const [status, setStatus] = useState("Finding a driver...");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const movementInterval = useRef(null);

  const statusMessages = {
    searching: "Finding a driver...",
    arriving: "Driver is on the way...",
    arrived: "Driver has arrived!",
    ongoing: "Ride in progress...",
    completed: "Ride Completed! 🎉",
  };

  const generateDriver = (pickupCoords) => ({
    id: Math.random().toString(36).substr(2, 9),
    name: "Rahul Sharma",
    car: "Toyota Etios - GJ05AB1234",
    phone: "+91 98765 43210",
    fare: "₹150 - ₹200",
    position: generateFartherCoords(pickupCoords),
  });

  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      if (response.data.length > 0) {
        return [
          parseFloat(response.data[0].lat),
          parseFloat(response.data[0].lon),
        ];
      }
      throw new Error("No coordinates found");
    } catch (error) {
      setError("Failed to fetch locations");
      return null;
    }
  };

  const fetchRoute = async (start, end) => {
    try {
      const response = await axios.get(
        `${OSRM_API_URL}${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      );
      if (response.data.routes?.[0]?.geometry?.coordinates) {
        return response.data.routes[0].geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );
      }
      throw new Error("No route found");
    } catch (error) {
      setError("Route calculation failed");
      return null;
    }
  };

  useEffect(() => {
    const initializeRide = async () => {
      if (!pickup || !drop) return navigate("/home");

      try {
        const pickupLocation = await fetchCoordinates(pickup);
        const dropLocation = await fetchCoordinates(drop);
        if (!pickupLocation || !dropLocation) return;

        setPickupCoords(pickupLocation);
        setDropCoords(dropLocation);

        const newDriver = generateDriver(pickupLocation);
        setDriver(newDriver);

        // Get initial route
        const initialRoute = await fetchRoute(
          newDriver.position,
          pickupLocation
        );
        if (!initialRoute) return;

        setRoute(initialRoute);
        startMovement(initialRoute, statusMessages.arriving, async () => {
          setStatus(statusMessages.arrived);
          const rideRoute = await fetchRoute(pickupLocation, dropLocation);
          if (rideRoute) setRoute(rideRoute);
        });
      } catch (error) {
        setError("Ride initialization failed");
      }
    };

    initializeRide();
    return () => clearInterval(movementInterval.current);
  }, [pickup, drop]);

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

      setDriver((prev) => ({ ...prev, position: path[currentStep] }));
      setProgress((currentStep / path.length) * 100);
      currentStep++;
    }, 150);
  };

  const startRide = () => {
    setStatus(statusMessages.ongoing);
    startMovement(route, statusMessages.ongoing, () => {
      setStatus(statusMessages.completed);
    });
  };

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!driver || !pickupCoords || !dropCoords) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-pulse text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{status}</h2>
              <p className="text-gray-600">{driver.car}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-purple-600">
                {driver.fare}
              </p>
              <p className="text-sm text-gray-500">Estimated Fare</p>
            </div>
          </div>

          <div className="relative pt-2">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Map Container */}
        <div className="h-96 rounded-xl overflow-hidden shadow-lg">
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
            <Marker position={pickupCoords}>
              <Popup>Pickup Location</Popup>
            </Marker>
            <Marker position={dropCoords}>
              <Popup>Drop Location</Popup>
            </Marker>
            <DriverMarker position={driver.position} />
            <Polyline positions={route} color="#3B82F6" />
          </MapContainer>
        </div>

        {/* Driver Details */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚕</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{driver.name}</h3>
              <p className="text-gray-600">{driver.phone}</p>
            </div>
            {status === statusMessages.arrived && (
              <button
                onClick={startRide}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Ride
              </button>
            )}
            {status === statusMessages.completed && (
              <button
                onClick={() => navigate("/home")}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Finish Ride
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RideStatusPage;
