import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DriverRideRequests = () => {
  const navigate = useNavigate();

  // 🔹 Static ride requests (Replace this with backend API response)
  const [rideRequests, setRideRequests] = useState([
    {
      id: "ride1",
      pickup: "Ronak Tyre Road, Anand, Gujarat",
      drop: "Vallabh Vidyanagar, Gujarat",
      distance: "5.4 km",
      fare: "₹150",
      riderName: "Amit Patel",
    },
    {
      id: "ride2",
      pickup: "Anand Railway Station, Gujarat",
      drop: "Milk City, Anand",
      distance: "7.2 km",
      fare: "₹200",
      riderName: "Sneha Desai",
    },
  ]);

  // 🔹 Handle Ride Acceptance
  const acceptRide = (ride) => {
    console.log("Accepted Ride:", ride);
    // 🚀 Redirect to Ride Status Page with selected ride details
    navigate("/driver-status", { state: { ride } });
  };

  // 🔹 Handle Ride Rejection
  const rejectRide = (rideId) => {
    console.log("Rejected Ride:", rideId);
    // ❌ Remove the ride request from the list
    setRideRequests((prevRequests) =>
      prevRequests.filter((ride) => ride.id !== rideId)
    );
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🚗 Ride Requests
      </h1>

      {rideRequests.length === 0 ? (
        <p className="text-lg text-gray-600">No new ride requests.</p>
      ) : (
        <div className="w-full max-w-md space-y-4">
          {rideRequests.map((ride) => (
            <motion.div
              key={ride.id}
              className="bg-white p-5 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-3">
                <p className="text-lg font-semibold">
                  {ride.riderName} needs a ride
                </p>
                <p className="text-gray-600">
                  📍 <strong>Pickup:</strong> {ride.pickup}
                </p>
                <p className="text-gray-600">
                  📍 <strong>Drop:</strong> {ride.drop}
                </p>
                <p className="text-gray-600">
                  📏 <strong>Distance:</strong> {ride.distance}
                </p>
                <p className="text-gray-600">
                  💰 <strong>Fare:</strong> {ride.fare}
                </p>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
                  onClick={() => acceptRide(ride)}
                >
                  ✅ Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
                  onClick={() => rejectRide(ride.id)}
                >
                  ❌ Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverRideRequests;
