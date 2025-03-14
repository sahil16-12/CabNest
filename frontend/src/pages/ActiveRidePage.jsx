import { useEffect, useState, useRef } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { server } from "../main";
import {
  Phone,
  MessageSquare,
  CheckCircle,
  MapPin,
  Navigation,
  Check,
  X,
  Clock,
} from "lucide-react";
import { io } from "socket.io-client";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

// Custom icons
const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3097/3097144.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
  className: "car-icon-pulse",
});
const pickupIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});
const dropIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const OSRM_API_URL = "https://router.project-osrm.org/route/v1/driving/";

// Component to recenter map when driver position changes
const RecenterAutomatically = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
};

const DriverMarker = ({ position }) => {
  return position ? (
    <Marker position={position} icon={driverIcon}>
      <Popup>Your current location</Popup>
    </Marker>
  ) : null;
};

const ActiveRidePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useRef(null);
  const { ride, driver, otp } = location.state || {};

  const [driverPosition, setDriverPosition] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [rider, setRider] = useState(null);
  const [route, setRoute] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [cumulativeDistances, setCumulativeDistances] = useState([]);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [rideStatus, setRideStatus] = useState("to_pickup"); // to_pickup, at_pickup, ongoing, at_destination, completed
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [showChatModal, setShowChatModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [rideStarted, setRideStarted] = useState(false);
  const [rideCompleted, setRideCompleted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const rideStartTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const movementInterval = useRef(null);

  const statusMessages = {
    to_pickup: "Heading to pickup location",
    at_pickup: "Arrived at pickup location",
    ongoing: "Ride in progress",
    at_destination: "Arrived at destination",
    completed: "Ride completed",
  };

  // Fetch route along with step‑by‑step instructions
  const fetchRoute = async (start, end) => {
    try {
      const startLngLat = `${start[1]},${start[0]}`;
      const endLngLat = `${end[1]},${end[0]}`;
      const response = await axios.get(
        `${OSRM_API_URL}${startLngLat};${endLngLat}?overview=full&geometries=geojson&steps=true`
      );
      if (response.data.routes?.[0]) {
        const routeData = response.data.routes[0];
        const coordinates = routeData.geometry.coordinates.map(([lng, lat]) => [
          lat,
          lng,
        ]);
        const steps = routeData.legs[0].steps;
        const totalDist = routeData.distance;
        return { coordinates, steps, totalDistance: totalDist };
      }
      throw new Error("No route found");
    } catch (error) {
      console.error("Route calculation failed:", error);
      setError("Route calculation failed");
      return null;
    }
  };

  // Compute cumulative distances from the steps for tracking
  useEffect(() => {
    if (instructions.length > 0) {
      let cum = [];
      let sum = 0;
      instructions.forEach((step) => {
        sum += step.distance;
        cum.push(sum);
      });
      setCumulativeDistances(cum);
    }
  }, [instructions]);

  useEffect(() => {
    const initSocket = async () => {
      const io = await import("socket.io-client");
      socket.current = io.connect(server);
      if (driver && driver._id) {
        socket.current.emit("register-driver", driver._id);
      }
      // Listen for incoming messages
      socket.current.on("receive-message", (messageData) => {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: messageData.senderRole,
            text: messageData.text,
            time: new Date(messageData.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      });

      socket.current.on("message-sent", (messageData) => {
        console.log("Message delivered to server:", messageData);
      });
      socket.current.on("connect", () =>
        console.log("Driver socket connected:", socket.current.id)
      );
      socket.current.on("disconnect", () =>
        console.log("Driver socket disconnected")
      );
    };

    initSocket();
    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [driver, ride]);

  useEffect(() => {
    const initializeRide = async () => {
      if (!driver || !ride) {
        setError("Missing ride information");
        return navigate("/driver-dashboard");
      }
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${server}/api/rider/${ride.riderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRider(response.data);
        const pickupLocation = [
          ride.pickup.coordinates.coordinates[1],
          ride.pickup.coordinates.coordinates[0],
        ];
        const dropLocation = [
          ride.drop.coordinates.coordinates[1],
          ride.drop.coordinates.coordinates[0],
        ];
        const initialDriverPosition = [
          driver.currentLocation.coordinates[1],
          driver.currentLocation.coordinates[0],
        ];
        setPickupCoords(pickupLocation);
        setDropCoords(dropLocation);
        setDriverPosition(initialDriverPosition);
        const initialRouteData = await fetchRoute(
          initialDriverPosition,
          pickupLocation
        );
        if (!initialRouteData) throw new Error("Failed to calculate route");
        setRoute(initialRouteData.coordinates);
        setInstructions(initialRouteData.steps);
        setTotalDistance(initialRouteData.totalDistance);
        startMovement(initialRouteData.coordinates, "to_pickup", async () => {
          setRideStatus("at_pickup");
          setShowOtpDialog(true);
        });
        const pickupToDropRouteData = await fetchRoute(
          pickupLocation,
          dropLocation
        );
        if (pickupToDropRouteData) {
          window.pickupToDropRouteData = pickupToDropRouteData;
        }
      } catch (error) {
        console.error("Ride initialization failed:", error);
        setError(error.message || "Failed to initialize ride");
      }
    };

    initializeRide();
    return () => {
      clearInterval(movementInterval.current);
      clearInterval(timerIntervalRef.current);
    };
  }, [driver, ride, navigate]);

  const startMovement = (path, status, onComplete) => {
    clearInterval(movementInterval.current);
    setRideStatus(status);
    let currentStep = 0;
    const totalSteps = path.length;
    movementInterval.current = setInterval(() => {
      if (currentStep >= totalSteps - 1) {
        clearInterval(movementInterval.current);
        if (onComplete) onComplete();
        return;
      }
      const newPosition = path[currentStep];
      setDriverPosition(newPosition);
      if (socket.current && driver && driver._id) {
        socket.current.emit("updateLocation", {
          driverId: driver._id,
          latitude: newPosition[0],
          longitude: newPosition[1],
        });
      }
      setProgress((currentStep / totalSteps) * 100);

      // Update current instruction index based on traveled distance
      if (totalDistance && cumulativeDistances.length > 0) {
        const traveledDistance = (currentStep / totalSteps) * totalDistance;
        const nextInstructionIndex = cumulativeDistances.findIndex(
          (d) => d > traveledDistance
        );
        if (nextInstructionIndex !== -1) {
          setCurrentInstructionIndex(nextInstructionIndex);
        }
      }
      currentStep++;
    }, 150);
  };

  const verifyOtp = () => {
    if (enteredOtp === String(otp)) {
      setOtpVerified(true);
      setShowOtpDialog(false);
      toast.success("OTP verified successfully!");
      if (socket.current && ride && ride._id) {
        socket.current.emit("otp-verified", {
          rideId: ride._id,
          riderId: ride.riderId,
        });
      }
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const startRide = () => {
    if (!otpVerified) {
      setShowOtpDialog(true);
      return;
    }
    setRideStarted(true);
    setRideStatus("ongoing");
    rideStartTimeRef.current = new Date();
    timerIntervalRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor(
        (new Date() - rideStartTimeRef.current) / 1000
      );
      setElapsedTime(elapsedSeconds);
    }, 1000);
    const pickupToDropRouteData = window.pickupToDropRouteData;
    if (pickupToDropRouteData && pickupToDropRouteData.coordinates.length > 0) {
      setRoute(pickupToDropRouteData.coordinates);
      setInstructions(pickupToDropRouteData.steps);
      setTotalDistance(pickupToDropRouteData.totalDistance);
      startMovement(pickupToDropRouteData.coordinates, "ongoing", () => {
        setRideStatus("at_destination");
      });
    } else {
      fetchRoute(pickupCoords, dropCoords).then((newRouteData) => {
        if (newRouteData) {
          setRoute(newRouteData.coordinates);
          setInstructions(newRouteData.steps);
          setTotalDistance(newRouteData.totalDistance);
          startMovement(newRouteData.coordinates, "ongoing", () => {
            setRideStatus("at_destination");
          });
        } else {
          toast.error("Could not calculate route to destination");
        }
      });
    }
  };

  const completeRide = () => {
    clearInterval(timerIntervalRef.current);
    setRideCompleted(true);
    setRideStatus("completed");
    const updateRideStatus = async () => {
      try {
        const token = sessionStorage.getItem("token");
        await axios.post(
          `${server}/api/ride/${ride._id}/complete`,
          { driverId: driver._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Ride completed successfully!");
      } catch (error) {
        console.error("Failed to update ride status:", error);
        toast.error("Failed to update ride status");
      }
    };
    updateRideStatus();
    navigate("/driver-dashboard");
  };

  // Real-time chat send function for driver
  const sendMessage = () => {
    if (!message.trim()) return;

    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage = {
      sender: "driver",
      text: message,
      time: formattedTime,
    };

    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    if (socket.current && ride) {
      socket.current.emit("send-message", {
        senderId: driver._id,
        receiverId: ride.riderId,
        message: message,
        rideId: ride._id,
        senderRole: "driver",
      });
    }

    setMessage("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl text-red-600 flex items-center">
          <div className="mr-2">❌</div> {error}
        </div>
      </div>
    );
  }

  if (!ride || !pickupCoords || !dropCoords) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-pulse text-2xl text-gray-600">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
            <div
              className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
          <div className="mt-4">Loading ride information...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {statusMessages[rideStatus]}
              </h2>
              <p className="text-gray-600">
                {rideStatus === "to_pickup" ? (
                  <span className="flex items-center">
                    <MapPin size={16} className="mr-1" /> En route to pickup
                  </span>
                ) : rideStatus === "at_pickup" ? (
                  <span className="flex items-center">
                    <CheckCircle size={16} className="mr-1" /> At pickup
                    location
                  </span>
                ) : rideStatus === "ongoing" ? (
                  <span className="flex items-center">
                    <Navigation size={16} className="mr-1" /> Navigating to
                    destination
                  </span>
                ) : rideStatus === "at_destination" ? (
                  <span className="flex items-center">
                    <Navigation size={16} className="mr-1" /> Arrived at
                    destination
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Check size={16} className="mr-1" /> Ride completed
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500">{ride.distance} km</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-purple-600">
                ₹{ride.fare}
              </p>
              <p className="text-sm text-gray-500">Fare</p>
              {rideStarted && (
                <p className="text-sm flex items-center justify-end mt-1">
                  <Clock size={14} className="mr-1" /> {formatTime(elapsedTime)}
                </p>
              )}
            </div>
          </div>
          <div className="relative pt-2">
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                className="h-2 bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setShowChatModal(true)}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <MessageSquare size={16} /> Message
            </button>
            {rideStatus === "at_pickup" && !rideStarted && (
              <button
                onClick={startRide}
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Navigation size={16} /> Start Ride
              </button>
            )}
          </div>
        </motion.div>

        <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
          <MapContainer
            center={driverPosition || [12.9716, 77.5946]}
            zoom={14}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {(!rideStarted ||
              rideStatus === "to_pickup" ||
              rideStatus === "at_pickup") && (
              <Marker position={pickupCoords} icon={pickupIcon}>
                <Popup>{ride.pickup.address}</Popup>
              </Marker>
            )}
            {(rideStarted ||
              rideStatus === "ongoing" ||
              rideStatus === "at_destination" ||
              rideStatus === "completed") && (
              <Marker position={dropCoords} icon={dropIcon}>
                <Popup>{ride.drop.address}</Popup>
              </Marker>
            )}
            {driverPosition && <DriverMarker position={driverPosition} />}
            <RecenterAutomatically position={driverPosition} />
            {route.length > 0 && (
              <Polyline positions={route} color="#0000FF" weight={4} />
            )}
          </MapContainer>
          {/* Button overlay on the map for route info */}
          <button
            onClick={() => setShowRouteModal(true)}
            className="absolute top-2 right-2 bg-white px-3 py-2 rounded shadow-md text-sm font-medium"
          >
            Route Info
          </button>
        </div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-3xl">👤</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {rider?._id?.name || rider?.name || "Rider"}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-gray-600">{rider?.phoneNumber || "N/A"}</p>
                {rider?.phoneNumber && (
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    title="Call rider"
                    onClick={() =>
                      window.open(`tel:${rider.phoneNumber}`, "_self")
                    }
                  >
                    <Phone size={16} />
                  </button>
                )}
              </div>
              <div className="text-sm text-gray-500">
                <div className="mt-1">
                  <strong>Pickup:</strong> {ride.pickup.address}
                </div>
                <div className="mt-1">
                  <strong>Drop:</strong> {ride.drop.address}
                </div>
              </div>
            </div>
            {rideStatus === "at_pickup" && !rideStarted && !otpVerified && (
              <button
                onClick={() => setShowOtpDialog(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Verify OTP
              </button>
            )}
            {rideStatus === "at_destination" && (
              <button
                onClick={completeRide}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Complete Ride
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* OTP verification modal */}
      <AnimatePresence>
        {showOtpDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">Verify Ride OTP</h3>
                <button
                  onClick={() => setShowOtpDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Ask the rider for their OTP to verify and start the ride
              </p>
              <div className="mb-6">
                <input
                  type="text"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full text-center text-3xl py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-center">
                <button
                  onClick={verifyOtp}
                  disabled={enteredOtp.length !== 6}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    enteredOtp.length === 6
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Verify OTP
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat modal */}
      <AnimatePresence>
        {showChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-4 max-w-md w-full h-[70vh] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {rider?._id.name || "Rider"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {ride.pickup.address}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-1">
                {chatMessages.map((msg, index) => {
                  const isDriverMessage = msg.sender === "driver";
                  return (
                    <div
                      key={index}
                      className={`mb-3 flex ${
                        isDriverMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          isDriverMessage
                            ? "bg-blue-500 text-white rounded-tr-none"
                            : "bg-gray-200 text-gray-800 rounded-tl-none"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isDriverMessage ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Send
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route Info modal */}
      <AnimatePresence>
        {showRouteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Route Details</h3>
                <button
                  onClick={() => setShowRouteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div>
                {instructions.length > 0 ? (
                  <ul className="space-y-2">
                    {instructions.map((step, index) => (
                      <li key={index} className="text-sm">
                        {step.maneuver.instruction} {Math.round(step.distance)}m
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm">No route details available</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActiveRidePage;
