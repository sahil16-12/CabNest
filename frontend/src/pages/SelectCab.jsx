import React from "react";
import { useLocation } from "react-router-dom";

const SelectCab = () => {
  const location = useLocation();
  const { drivers } = location.state || { drivers: [] };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Select Your Cab</h1>
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        {drivers.length > 0 ? (
          drivers.map((driver) => (
            <div
              key={driver.id}
              className="flex justify-between items-center p-4 border-b border-gray-200"
            >
              <div>
                <p className="font-semibold">{driver.name}</p>
                <p className="text-sm text-gray-500">{driver.car}</p>
                <p className="text-sm text-yellow-500">
                  Rating: {driver.rating} ⭐
                </p>
              </div>
              <p className="text-gray-700">{driver.distance}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No drivers available.</p>
        )}
      </div>
    </div>
  );
};

export default SelectCab;
