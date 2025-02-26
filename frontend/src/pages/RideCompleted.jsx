import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const RideCompletionPage = () => {
  const navigate = useNavigate();

  // Sample ride data (replace with actual data)
  const rideDetails = {
    fare: "₱450",
    distance: "15.2 km",
    duration: "28 mins",
    earnings: "₱398.50",
    riderName: "Sarah Johnson",
    riderRating: 4.8,
    pickup: "Central Business District",
    drop: "Eastwood City",
    timestamp: "8:45 PM, Sep 25 2023",
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon
              icon="mdi:check-circle"
              className="text-6xl text-green-500 animate-pulse"
            />
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Ride Completed!
          </h1>
          <p className="text-blue-600 text-lg">
            You've earned ₹398.50 from this trip
          </p>
        </motion.div>

        {/* Ride Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl mb-8 border border-blue-100"
        >
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <StatItem
                icon="mdi:currency-php"
                label="Total Fare"
                value={rideDetails.fare}
              />
              <StatItem
                icon="mdi:road-variant"
                label="Distance"
                value={rideDetails.distance}
              />
              <StatItem
                icon="mdi:clock-outline"
                label="Duration"
                value={rideDetails.duration}
              />
            </div>
            <div className="space-y-2">
              <StatItem
                icon="mdi:wallet-outline"
                label="Your Earnings"
                value={rideDetails.earnings}
              />
              <StatItem
                icon="mdi:account-outline"
                label="Rider"
                value={rideDetails.riderName}
              />
              <StatItem
                icon="mdi:star-outline"
                label="Rider Rating"
                value={rideDetails.riderRating}
              />
            </div>
          </div>

          <div className="border-t border-blue-50 pt-6">
            <div className="flex items-center gap-4 text-blue-600">
              <Icon icon="mdi:map-marker-path" className="text-2xl" />
              <div>
                <p className="font-semibold">Route</p>
                <p className="text-sm">
                  {rideDetails.pickup} → {rideDetails.drop}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4"
        >
          <button
            onClick={() => navigate("/earnings")}
            className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold
            flex items-center justify-center gap-2 transition-all
            hover:bg-blue-700 hover:shadow-lg"
          >
            <Icon icon="mdi:currency-php" className="text-xl" />
            Earnings Details
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 bg-white text-blue-600 py-4 rounded-xl font-bold
            flex items-center justify-center gap-2 transition-all border-2 border-blue-100
            hover:bg-blue-50 hover:border-blue-200"
          >
            <Icon icon="mdi:car-connected" className="text-xl" />
            New Ride
          </button>
        </motion.div>

        {/* Rate Rider Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-xl border border-blue-100"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Rate Your Rider
          </h3>
          <div className="flex gap-2 justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="text-3xl text-yellow-400 hover:text-yellow-500"
              >
                <Icon icon="mdi:star-outline" />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Add optional feedback..."
            className="w-full p-3 border border-blue-100 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-200"
            rows="2"
          />
        </motion.div>
      </div>
    </div>
  );
};

const StatItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <Icon icon={icon} className="text-xl text-blue-500" />
    <div>
      <p className="text-sm text-blue-400">{label}</p>
      <p className="font-semibold text-blue-900">{value}</p>
    </div>
  </div>
);

export default RideCompletionPage;
