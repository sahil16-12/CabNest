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
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { server } from "../main";
import { useDriverDashboardC } from "../context/DriverDashboardContext.";
import { Phone, MessageSquare, AlertTriangle, X } from "lucide-react";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

// Custom icons
const carIcon = new L.Icon({
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
const driverStartIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const OSRM_API_URL = "https://router.project-osrm.org/route/v1/driving/";

const DriverMarker = ({ position, startPosition, rideStatus }) => {
  const markerRef = useRef(null);
  const map = useMap();
  useEffect(() => {
    if (markerRef.current && position) {
      markerRef.current.setLatLng(position);
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return (
    <>
      {rideStatus === "arriving" && startPosition && (
        <Marker position={startPosition} icon={driverStartIcon}>
          <Popup>Driver&apos;s Starting Position</Popup>
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
  const { ride, driver, otp } = location.state || {};
  const socket = useRef(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [driverData, setDriverData] = useState(null);
  const [route, setRoute] = useState([]);
  const [status, setStatus] = useState("Finding driver...");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [canStartRide, setCanStartRide] = useState(false);
  const [rideStarted, setRideStarted] = useState(false);
  const [rideCompleted, setRideCompleted] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [pickupToDropRoute, setPickupToDropRoute] = useState([]);
  const movementInterval = useRef(null);
  const { updateEarnings, updateTotalDistance } = useDriverDashboardC();

  const otpInputRef = useRef(null);

  const statusMessages = {
    searching: "Finding driver...",
    arriving: "Driver is on the way...",
    arrived: "Driver has arrived!",
    otpVerify: "Please verify OTP with driver",
    ongoing: "Ride in progress...",
    completed: "Ride Completed! 🎉",
  };

  const checkoutHandler = async () => {
    const earning = ride.fare * 0.8;
    console.log("checkoutHandler me");
    console.log(driver._id);
    await updateEarnings(earning, driver._id._id);
    await updateTotalDistance(ride.distance, driver._id._id);
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
        amount: ride.fare,
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
          const driverId = "12345"; // Replace with the actual driver ID
          navigate(
            `/payment-successful/${response.razorpay_payment_id}?driverId=${driver._id._id}`
          );
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
      const startLngLat = `${start[1]},${start[0]}`;
      const endLngLat = `${end[1]},${end[0]}`;
      const response = await axios.get(
        `${OSRM_API_URL}${startLngLat};${endLngLat}?overview=full&geometries=geojson`
      );
      if (response.data.routes?.[0]?.geometry?.coordinates) {
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
    const initSocket = async () => {
      const io = await import("socket.io-client");
      socket.current = io.connect(server);
      if (ride && ride.riderId) {
        socket.current.emit("register-rider", ride.riderId);
      }
      socket.current.on("connect", () =>
        console.log("Rider socket connected:", socket.current.id)
      );
      socket.current.on("disconnect", () =>
        console.log("Rider socket disconnected")
      );
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
            isFromRider: messageData.senderRole === "rider",
          },
        ]);
      });

      socket.current.on("message-sent", (messageData) => {
        console.log("Message delivered to server:", messageData);
      });

      socket.current.on("otp-verified", (data) => {
        if (data.rideId === ride._id) {
          setOtpVerified(true);
          toast.success("OTP has been verified by the driver!");
          setShowOtpDialog(false);
        }
      });
    };

    initSocket();
    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [ride]);

  useEffect(() => {
    const initializeRide = async () => {
      if (!driver || !ride) {
        setError("Missing ride information");
        return navigate("/ride-book");
      }
      try {
        const pickupLocation = [
          ride.pickup.coordinates.coordinates[1],
          ride.pickup.coordinates.coordinates[0],
        ];
        const dropLocation = [
          ride.drop.coordinates.coordinates[1],
          ride.drop.coordinates.coordinates[0],
        ];
        const driverStartPosition = [
          driver.currentLocation.coordinates[1],
          driver.currentLocation.coordinates[0],
        ];
        setPickupCoords(pickupLocation);
        setDropCoords(dropLocation);
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
        const initialRoute = await fetchRoute(
          driverStartPosition,
          pickupLocation
        );
        if (!initialRoute) throw new Error("Failed to calculate route");
        const pickupToDropRoute = await fetchRoute(
          pickupLocation,
          dropLocation
        );
        if (pickupToDropRoute) {
          setPickupToDropRoute(pickupToDropRoute);
        }
        setRoute(initialRoute);
        setStatus(statusMessages.arriving);
        startMovement(initialRoute, statusMessages.arriving, async () => {
          setStatus(statusMessages.arrived);
          setShowOtpDialog(true);
          setStatus(statusMessages.otpVerify);
          setCanStartRide(true);
          setTimeout(() => {
            if (otpInputRef.current) {
              otpInputRef.current.focus();
            }
          }, 300);
        });
      } catch (error) {
        console.error("Ride initialization failed:", error);
        setError(error.message);
      }
    };

    initializeRide();
    return () => clearInterval(movementInterval.current);
  }, [driver, ride, navigate]);

  const startMovement = (path, statusMessage, onComplete) => {
    clearInterval(movementInterval.current);
    setStatus(statusMessage);
    let currentStep = 0;
    const totalSteps = path.length;
    movementInterval.current = setInterval(() => {
      if (currentStep >= totalSteps) {
        clearInterval(movementInterval.current);
        onComplete?.();
        return;
      }
      setDriverData((prev) => ({ ...prev, position: path[currentStep] }));
      setProgress((currentStep / totalSteps) * 100);
      currentStep++;
    }, 150);
  };

  const startRide = () => {
    if (!otpVerified) {
      setShowOtpDialog(true);
      toast.error(
        "OTP not verified yet. Please wait for the driver to verify OTP."
      );
      return;
    }
    setStatus(statusMessages.ongoing);
    setShowOtpDialog(false);
    setRideStarted(true);
    if (pickupToDropRoute.length > 0) {
      setRoute(pickupToDropRoute);
      startMovement(pickupToDropRoute, statusMessages.ongoing, () => {
        setStatus(statusMessages.completed);
        setRideCompleted(true);
      });
    } else {
      const calculateRideRoute = async () => {
        try {
          const rideRoute = await fetchRoute(pickupCoords, dropCoords);
          if (rideRoute) {
            setRoute(rideRoute);
            startMovement(rideRoute, statusMessages.ongoing, () => {
              setStatus(statusMessages.completed);
              setRideCompleted(true);
            });
          } else {
            toast.error("Could not calculate route to destination");
          }
        } catch (error) {
          console.error("Failed to calculate ride route:", error);
          toast.error("Error starting ride");
        }
      };
      calculateRideRoute();
    }
  };

  const cancelRide = () => {
    toast.info("Ride cancelled successfully");
    navigate("/ride-book");
  };

  // Real-time chat send function for rider
  const sendMessage = () => {
    if (!message.trim()) return;

    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Add to local state first with isFromRider flag set to true
    const newMessage = {
      sender: "rider",
      text: message,
      time: formattedTime,
      isFromRider: true, // explicitly mark this as from rider
    };

    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    // Send via socket
    if (socket.current && ride && ride.driverId) {
      socket.current.emit("send-message", {
        senderId: ride.riderId,
        receiverId: ride.driverId,
        message: message,
        rideId: ride._id,
        senderRole: "rider",
      });
    }

    setMessage("");
  };

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl text-red-600 flex items-center">
          <AlertTriangle className="mr-2" /> {error}
        </div>
      </div>
    );
  }

  if (!driverData || !pickupCoords || !dropCoords) {
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
              <p className="text-sm text-gray-500">Fare</p>
              <p className="text-sm text-gray-500">{ride.distance} km</p>
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
          </div>
        </motion.div>
        <div className="h-96 rounded-xl overflow-hidden shadow-lg">
          <MapContainer
            center={pickupCoords || [12.9716, 77.5946]}
            zoom={14}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {!rideStarted && pickupCoords && (
              <Marker position={pickupCoords} icon={pickupIcon}>
                <Popup>{ride.pickup.address}</Popup>
              </Marker>
            )}
            {(rideStarted || status === statusMessages.completed) &&
              dropCoords && (
                <Marker position={dropCoords} icon={dropIcon}>
                  <Popup>{ride.drop.address}</Popup>
                </Marker>
              )}
            {driverData?.position && (
              <DriverMarker
                position={driverData.position}
                startPosition={driverData.startPosition}
                rideStatus={
                  status === statusMessages.arriving
                    ? "arriving"
                    : status === statusMessages.ongoing
                    ? "ongoing"
                    : "other"
                }
              />
            )}
            {route.length > 0 && (
              <Polyline positions={route} color="#0000FF" weight={4} />
            )}
          </MapContainer>
        </div>
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-3xl">🚕</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{driverData.name}</h3>
              <div className="flex items-center gap-2">
                <p className="text-gray-600">{driverData.phone}</p>
                <button
                  className="text-blue-500 hover:text-blue-700"
                  title="Call driver"
                  onClick={() =>
                    window.open(`tel:${driverData.phone}`, "_self")
                  }
                >
                  <Phone size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 flex items-center">
                  ★ {driverData.rating || "No ratings"}
                </span>
                <span className="text-sm text-gray-500">
                  License: {driverData.licenseNumber}
                </span>
              </div>
            </div>
            {canStartRide && !rideStarted && !rideCompleted && (
              <button
                onClick={startRide}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Ride
              </button>
            )}
            {rideCompleted && (
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
                <h3 className="text-2xl font-bold">Verify Your Ride</h3>
                <button
                  onClick={() => setShowOtpDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-600 text-center mb-6">
                Please share this OTP with your driver. Wait until the driver
                verifies it.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="text-center text-3xl font-bold tracking-wider text-blue-600">
                  {otp || "1234"}
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    if (otpVerified) {
                      setShowOtpDialog(false);
                    } else {
                      toast.error(
                        "OTP not verified yet by driver. Please wait."
                      );
                    }
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Confirm OTP Shared
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCancelDialog && (
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
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={32} className="text-red-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">
                Cancel Ride?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to cancel this ride? Cancellation fees may
                apply based on driver's travel time.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Go Back
                </button>
                <button
                  onClick={cancelRide}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Cancel Ride
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    <span className="text-xl">🚕</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{driver._id.name}</h3>
                    <p className="text-sm text-gray-500">{driverData.car}</p>
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
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-3 flex ${
                      msg.isFromRider ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        msg.isFromRider
                          ? "bg-blue-500 text-white rounded-tr-none"
                          : "bg-gray-200 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.isFromRider ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
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
    </div>
  );
};

export default RideStatusPage;
