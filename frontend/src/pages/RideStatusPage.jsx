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
import { toast } from "react-toastify";
import { server } from "../main";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

// Custom icons
const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2583/2583344.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const pickupIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const dropIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const driverStartIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const OSRM_API_URL = "https://router.project-osrm.org/route/v1/driving/";

const DriverMarker = ({ position, startPosition }) => {
  const markerRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    if (markerRef.current && position) {
      markerRef.current.setLatLng(position);
    }
  }, [position]);

  return (
    <>
      {startPosition && (
        <Marker position={startPosition} icon={driverStartIcon}>
          <Popup>Driver's Starting Position</Popup>
        </Marker>
      )}
      {position && (
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
      )}
    </>
  );
};

const RideStatusPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { driver, pick, Drop, ride } = location.state || {};

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [driverData, setDriverData] = useState(null);
  const [route, setRoute] = useState([]);
  const [status, setStatus] = useState("Finding driver...");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const movementInterval = useRef(null);

  const statusMessages = {
    searching: "Finding driver...",
    arriving: "Driver is on the way...",
    arrived: "Driver has arrived!",
    ongoing: "Ride in progress...",
    completed: "Ride Completed! 🎉",
  };

  const checkoutHandler = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const {
        data: { order },
      } = await axios.post(
        `${server}/api/ride/checkout/${ride.riderId}`,
        { amount: ride.fare * 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_test_RktGm4504pCbPL",
        amount: order.amount,
        currency: "INR",
        name: "CabNest",
        description: `Ride ${ride._id}`,
        order_id: order.id,
        handler: async (response) => {
          await axios.post(
            `${server}/api/ride/verification/${ride.riderId}`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              rideId: ride._id,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Payment successful!");
          navigate(`/payment-successfull/${response.razorpay_payment_id}`);
        },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    }
  };

  const fetchRoute = async (start, end) => {
    try {
      // Ensure coordinates are in the correct format for OSRM: [longitude, latitude]
      const startLngLat = `${start[1]},${start[0]}`;
      const endLngLat = `${end[1]},${end[0]}`;

      const response = await axios.get(
        `${OSRM_API_URL}${startLngLat};${endLngLat}?overview=full&geometries=geojson`
      );

      if (response.data.routes?.[0]?.geometry?.coordinates) {
        // Convert back to [latitude, longitude] for Leaflet
        return response.data.routes[0].geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );
      }
      throw new Error("No route found");
    } catch (error) {
      console.error("Route calculation failed:", error);
      setError("Route calculation failed");
      return null;
    }
  };

  useEffect(() => {
    const initializeRide = async () => {
      if (!driver || !pick || !Drop || !ride) {
        setError("Missing ride information");
        return navigate("/ride-book");
      }

      try {
        // Extract coordinates from backend data - ensure [lat, lng] format for Leaflet
        const pickupLocation = [pick.coordinates[1], pick.coordinates[0]]; // Swap to [lat, lng]
        const dropLocation = [Drop.coordinates[1], Drop.coordinates[0]]; // Swap to [lat, lng]
        const driverStartPosition = [
          driver.currentLocation.coordinates[1],
          driver.currentLocation.coordinates[0],
        ]; // Swap to [lat, lng]

        console.log("Pickup coordinates:", pickupLocation);
        console.log("Drop coordinates:", dropLocation);
        console.log("Driver start position:", driverStartPosition);

        setPickupCoords(pickupLocation);
        setDropCoords(dropLocation);

        // Set driver data from backend response
        setDriverData({
          id: driver._id,
          name: driver.name,
          car: `${driver.vehicleMake} ${driver.vehicleModel} (${driver.vehicleYear})`,
          phone: driver.phoneNumber,
          fare: `₹${ride.fare}`,
          rating: driver.overallRating,
          startPosition: driverStartPosition,
          position: driverStartPosition,
          vehicleColor: driver.vehicleColor,
          licenseNumber: driver.licenseNumber,
        });

        // Fetch initial route - we pass coordinates in [lat, lng] format,
        // but fetchRoute will handle conversion to the format OSRM needs
        const initialRoute = await fetchRoute(
          driverStartPosition,
          pickupLocation
        );
        if (!initialRoute) throw new Error("Failed to calculate route");

        setRoute(initialRoute);
        setStatus(statusMessages.arriving);

        startMovement(initialRoute, statusMessages.arriving, async () => {
          setStatus(statusMessages.arrived);
          const rideRoute = await fetchRoute(pickupLocation, dropLocation);
          if (rideRoute) setRoute(rideRoute);
        });
      } catch (error) {
        console.error("Ride initialization failed:", error);
        setError(error.message);
      }
    };

    initializeRide();
    return () => clearInterval(movementInterval.current);
  }, [driver, pick, Drop, ride, navigate]);

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

      setDriverData((prev) => ({ ...prev, position: path[currentStep] }));
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

  if (!driverData || !pickupCoords || !dropCoords) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-pulse text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{status}</h2>
              <p className="text-gray-600">{driverData.car}</p>
              <p className="text-sm text-gray-500">
                Color: {driverData.vehicleColor}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-purple-600">
                {driverData.fare}
              </p>
              <p className="text-sm text-gray-500">Estimated Fare</p>
              <p className="text-sm text-gray-500">{ride.distance} km</p>
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

        <div className="h-96 rounded-xl overflow-hidden shadow-lg">
          <MapContainer
            center={pickupCoords || [12.9716, 77.5946]}
            zoom={13}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {pickupCoords && (
              <Marker position={pickupCoords} icon={pickupIcon}>
                <Popup>{pick.address}</Popup>
              </Marker>
            )}

            {dropCoords && (
              <Marker position={dropCoords} icon={dropIcon}>
                <Popup>{Drop.address}</Popup>
              </Marker>
            )}

            {driverData?.position && (
              <DriverMarker
                position={driverData.position}
                startPosition={driverData.startPosition}
              />
            )}

            {route.length > 0 && <Polyline positions={route} color="#3B82F6" />}
          </MapContainer>
        </div>
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
              <h3 className="font-semibold text-lg">{driverData.name}</h3>
              <p className="text-gray-600">{driverData.phone}</p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">
                  ★ {driverData.rating || "No ratings"}
                </span>
                <span className="text-sm text-gray-500">
                  License: {driverData.licenseNumber}
                </span>
              </div>
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
                onClick={checkoutHandler}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Pay ₹{ride.fare}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RideStatusPage;
