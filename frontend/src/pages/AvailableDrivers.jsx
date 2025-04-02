import { useState } from "react";
import axios from "axios";
import { server } from "../main";

const AvailableDrivers = ({
  distance,
  duration,
  fare,
  pickup,
  drop,
  onClose,
  onBook,
}) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [showDrivers, setShowDrivers] = useState(false);

  const vehicleTypes = [
    { id: "car", name: "Car", icon: "🚗", baseRate: 50 },
    { id: "bike", name: "Bike", icon: "🏍️", baseRate: 26 },
    { id: "auto", name: "Auto", icon: "🛺", baseRate: 30 },
    { id: "scooter", name: "Scooter", icon: "🛵", baseRate: 20 },
  ];

  const fetchDriversByVehicleType = async (vehicleType) => {
    try {
      setLoading(true);
      setError(null);

      // API call to get nearby available drivers of selected type
      const response = await axios.get(`${server}/api/driver/available`, {
        params: {
          pickupLat: pickup?.lat,
          pickupLng: pickup?.lng,
          vehicleType: vehicleType,
        },
      });

      if (response.status === 200) {
        setDrivers(response.data.drivers);
        setShowDrivers(true);
      } else {
        setError("Failed to load drivers");
      }
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate ETA based on distance
  const calculateEta = () => {
    const averageSpeedKmPerHour = 30;
    const distanceInKm = distance;
    const etaMinutes = Math.ceil((distanceInKm / averageSpeedKmPerHour) * 60);
    return `${etaMinutes} min`;
  };

  // Calculate fare based on distance and vehicle type
  const calculateFare = (driverVehicleType) => {
    let baseRate;

    // Different rates based on vehicle type
    switch (driverVehicleType) {
      case "bike":
        baseRate = 26;
        break;
      case "auto":
        baseRate = 30;
        break;
      case "car":
        baseRate = 50;
        break;
      case "scooter":
        baseRate = 20;
        break;
      default:
        baseRate = 10;
    }

    return (distance * baseRate).toFixed(2);
  };

  // Get estimated fare for each vehicle type
  const getEstimatedFare = (vehicleType) => {
    const vehicle = vehicleTypes.find((v) => v.id === vehicleType);
    return (distance * vehicle.baseRate).toFixed(2);
  };

  const handleVehicleSelect = (vehicleType) => {
    setSelectedVehicleType(vehicleType);
    fetchDriversByVehicleType(vehicleType);
  };

  const handleBack = () => {
    setShowDrivers(false);
    setSelectedVehicleType(null);
  };

  if (loading) {
    return (
      <div className="relative w-full mt-4 p-8 bg-white rounded-2xl shadow-xl max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full mt-4 p-8 bg-white rounded-2xl shadow-xl max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Available Rides
          </h3>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="text-center text-red-500 py-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full mt-4 p-8 bg-white rounded-2xl shadow-xl max-w-4xl mx-auto transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {showDrivers
            ? `Available ${
                selectedVehicleType.charAt(0).toUpperCase() +
                selectedVehicleType.slice(1)
              }s`
            : "Select a Service"}
        </h3>
        <div className="flex items-center gap-2">
          {showDrivers && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {!showDrivers ? (
        // Vehicle type selection view
        <div className="grid gap-6 md:grid-cols-2 animate-fadeIn">
          {vehicleTypes.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-500"
              onClick={() => handleVehicleSelect(vehicle.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">{vehicle.icon}</span>
                  <h4 className="text-2xl font-semibold">{vehicle.name}</h4>
                </div>
                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">
                  {calculateEta()}
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-gray-600">
                  <span className="text-sm">Distance: {distance} km</span>
                </div>
                <p className="text-lg font-bold text-blue-600">
                  ₹{getEstimatedFare(vehicle.id)}
                </p>
              </div>

              <button className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity">
                Request {vehicle.name}
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Available drivers view
        <div className="animate-fadeIn">
          {drivers.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <div className="text-5xl mb-4">😔</div>
              <p className="text-xl mb-2">
                No {selectedVehicleType}s available nearby.
              </p>
              <p className="text-gray-400">
                Please try another service or try again later.
              </p>
              <button
                onClick={handleBack}
                className="mt-6 px-6 py-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
              >
                Try another service
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {drivers.map((driver) => (
                <div
                  key={driver._id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={`http://localhost:5000/${driver.profileImage?.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={`Driver ${driver._id.name}`}
                      className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-blue-500"
                    />
                    <div>
                      <h4 className="text-xl font-semibold">
                        {driver._id.name}
                      </h4>
                      <p className="text-gray-600">
                        {driver.vehicleMake} {driver.vehicleModel} (
                        {driver.vehicleYear})
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm">
                        <span className="font-medium">License:</span>{" "}
                        {driver.licenseNumber}
                      </p>
                      <div className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                        Available Now
                      </div>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">Reg Number:</span>{" "}
                      {driver.regNumber}
                    </p>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t">
                      <p className="text-lg font-bold text-blue-600">
                        ₹{calculateFare(driver.vehicleType)}
                      </p>
                      <p className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                        <span className="font-medium">ETA:</span>{" "}
                        {calculateEta()}
                      </p>
                    </div>
                  </div>
                  <button
                    className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
                    onClick={() => onBook(driver)}
                  >
                    <span>Book Now</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 border-t pt-4 text-center text-gray-500 text-sm">
        <p>
          Fare calculated based on estimated distance. Actual fare may vary.
        </p>
      </div>
    </div>
  );
};

export default AvailableDrivers;
