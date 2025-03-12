import React, { useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDriverDashboardC } from "../context/DriverDashboardContext.";

const PaymentSuccess = () => {
  const { paymentId } = useParams(); // Access paymentId from URL path
  const [searchParams] = useSearchParams(); // Access query parameters
  const driverId = searchParams.get("driverId"); // Access the driverId query parameter
  const { updateRating } = useDriverDashboardC(); // Use the updateRating function from context
  const navigate = useNavigate();
  const [rating, setRating] = useState(0); // State to store the selected rating
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle loading during submission

  // Handle rating submission
  const handleRatingSubmit = async () => {
    if (!rating) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateRating(rating, driverId); // Update rating for the driver
      toast.success("Thank you for your rating!");
      navigate("/"); // Navigate to the dashboard or home page after successful submission
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
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
        <p className="text-gray-600 mb-4">
          Thank you for choosing our service!
        </p>
        <p className="text-gray-700 font-semibold mb-6">
          Reference no - <span className="text-purple-600">{paymentId}</span>
        </p>

        {/* Rating Section */}
        <div className="mb-6">
          <p className="text-gray-700 font-semibold mb-2">
            Rate your experience with the driver:
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
      </div>
    </div>
  );
};

export default PaymentSuccess;
