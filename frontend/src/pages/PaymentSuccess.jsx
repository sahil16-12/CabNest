import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { toast } from "react-toastify";
import { useDriverDashboardC } from "../context/DriverDashboardContext.";

const PaymentSuccess = () => {
  const { user } = UserData();
  const {
    earnings,
    overallRating,
    totalDistance,
    status,
    isLoading,
    updateRating,
    updateEarnings,
    updateTotalDistance,
    toggleAvailability,
    refreshData,
  } = useDriverDashboardC();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0); // State to store the selected rating
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle loading during submission

  // Fetch dashboard data on component mount
  useEffect(() => {
    refreshData(); // Fetch all dashboard data

    // Cleanup function to reset data when navigating away
    return () => {
      // Reset dashboard data (optional, depending on your use case)
    };
  }, [refreshData]);

  // Handle rating submission
  const handleRatingSubmit = async () => {
    if (!rating) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateRating(rating); // Update rating
      toast.success("Thank you for your rating!");
      navigate("/"); // Navigate to the dashboard after successful submission
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Temporary buttons to test earnings and distance updates
  const handleTestEarnings = async () => {
    try {
      await updateEarnings(25); // Test earnings update with $25
      toast.success("Earnings updated successfully!");
    } catch (error) {
      console.error("Error updating earnings:", error);
      toast.error("Failed to update earnings.");
    }
  };

  const handleTestDistance = async () => {
    try {
      await updateTotalDistance(10); // Test distance update with 10 km
      toast.success("Distance updated successfully!");
    } catch (error) {
      console.error("Error updating distance:", error);
      toast.error("Failed to update distance.");
    }
  };

  // Toggle driver availability
  const handleToggleAvailability = async () => {
    try {
      await toggleAvailability();
      toast.success(
        `Status updated to ${status === "online" ? "offline" : "online"}`
      );
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast.error("Failed to toggle availability.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center transform transition-all hover:scale-105">
        <div className="flex justify-center mb-6">
          <svg
            className="w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Successful
        </h2>
        <p className="text-gray-600 mb-4">Enjoy your ride</p>
        <p className="text-gray-700 font-semibold mb-6">
          Reference no -{" "}
          <span className="text-purple-600">"67cd760142152f19081081e9"</span>
        </p>

        {/* Static Data Section */}
        <div className="mb-6 text-left">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Ride Details
          </h3>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">Driver:</span> John Doe
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Vehicle:</span> Toyota Camry
              (AB1234)
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Distance:</span> 10 km
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Fare:</span> $25.00
            </p>
          </div>
        </div>

        {/* Dashboard Data Section */}
        <div className="mb-6 text-left">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Dashboard Data
          </h3>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">Earnings:</span> ${earnings.daily}{" "}
              (Daily), ${earnings.weekly} (Weekly), ${earnings.monthly}{" "}
              (Monthly), ${earnings.yearly} (Yearly)
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Overall Rating:</span>{" "}
              {overallRating}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Total Distance:</span>{" "}
              {totalDistance} km
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Status:</span> {status}
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-6 text-left">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Tips for a Great Ride
          </h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Always wear your seatbelt.</li>
            <li>Keep your belongings secure.</li>
            <li>Be respectful to your driver.</li>
            <li>Enjoy the journey!</li>
          </ul>
        </div>

        {/* Rating Section */}
        <div className="mb-6">
          <p className="text-gray-700 font-semibold mb-2">
            Rate your experience:
          </p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                } hover:text-yellow-500 transition duration-300`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Submit Rating Button */}
        <button
          onClick={handleRatingSubmit}
          disabled={isSubmitting}
          className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </button>

        {/* Temporary Buttons for Testing */}
        <button
          onClick={handleTestEarnings}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 mt-4"
        >
          Test Earnings Update ($25)
        </button>
        <button
          onClick={handleTestDistance}
          className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 mt-4"
        >
          Test Distance Update (10 km)
        </button>
        <button
          onClick={handleToggleAvailability}
          className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition duration-300 mt-4"
        >
          Toggle Availability
        </button>

        {/* Go to Dashboard Link */}
        <Link
          to={`/`}
          className="mt-4 inline-block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
