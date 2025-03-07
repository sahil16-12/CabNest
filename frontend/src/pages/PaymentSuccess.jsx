import React from "react";
import { Link, useParams } from "react-router-dom";
import { UserData } from "../context/UserContext";

const PaymentSuccess = () => {
  const params = useParams();
  // const {user}=UserData();
  const user = true;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
      {user == true && (
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
            Reference no - <span className="text-purple-600">{params.id}</span>
          </p>
          <Link
            to={`/`}
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
