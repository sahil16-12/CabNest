import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RideRequestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showBuffer, setShowBuffer] = useState(true);
  const [rideConfirmed, setRideConfirmed] = useState(false);

  // Extract driver and ride from navigation state
  const driver = location.state?.driver || null;
  const ride = location.state?.ride || null;

  // Extract pickup and drop locations from ride if available
  const pick = ride?.pickup.coordinates;
  const Drop = ride?.drop.coordinates;

  useEffect(() => {
    // If either driver or ride is missing, redirect back to ride booking page
    if (!driver || !ride) {
      navigate("/ride-book");
    } else {
      // Simulate backend delay and ride confirmation
      setTimeout(() => {
        setShowBuffer(false);
        setRideConfirmed(true);
      }, 3000); // 3 seconds delay for confirmation simulation

      setTimeout(() => {
        navigate("/ride-status", { state: { driver, pick, Drop, ride } });
      }, 5000); // Redirect after an additional 2 seconds (total 5 seconds)
    }
  }, [driver, ride, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        {showBuffer && (
          <>
            <p className="text-lg font-semibold text-blue-600">
              Requesting a ride...
            </p>
            <p className="text-gray-600 mt-2">
              Waiting for driver confirmation
            </p>
            <div className="mt-4">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          </>
        )}

        {rideConfirmed && driver && (
          <>
            <h2 className="text-xl font-bold text-green-600">
              Ride Confirmed!
            </h2>
            <p className="text-gray-700 mt-2">
              Your ride with{" "}
              <span className="font-semibold">{driver.name}</span> is on the
              way.
            </p>
            <p className="mt-2">ETA: {driver.eta} minutes</p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to ride status...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RideRequestPage;
