import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch available drivers
    const fetchAvailableDrivers = async () => {
      try {
        setLoading(true);

        // API call to get nearby available drivers
        const response = await axios.get(`${server}/api/driver/available`, {
          params: {
            pickupLat: pickup?.lat,
            pickupLng: pickup?.lng,
            vehicleType: "car",
          },
        });

        if (response.status === 200) {
          console.log(response.data.drivers);
          setDrivers(response.data.drivers);
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

    if (pickup?.lat !== undefined && pickup?.lng !== undefined) {
      fetchAvailableDrivers();
    }
  }, [pickup]);

  // Calculate ETA based on driver's current location and pickup location
  const calculateEta = (driverLocation) => {
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
    <div className="relative w-full mt-4 p-8 bg-white rounded-2xl shadow-xl max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Select a Driver
        </h3>
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>

      {drivers.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No drivers available nearby. Please try again later.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {drivers.map((driver) => (
            <div
              key={driver._id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <img
                  src={`http://localhost:5000/${driver.profileImage?.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt={`Driver ${driver._id.name}`}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-xl font-semibold">{driver._id.name}</h4>
                  <p className="text-gray-600">
                    {driver.vehicleMake} {driver.vehicleModel} (
                    {driver.vehicleYear})
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">License:</span>{" "}
                  {driver.licenseNumber}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Reg Number:</span>{" "}
                  {driver.regNumber}
                </p>
                <p className="text-lg font-bold text-blue-600">
                  Fare: ₹{calculateFare(driver.vehicleType)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">ETA:</span> {calculateEta()}
                </p>
              </div>
              <button
                className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                onClick={() => onBook(driver)}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableDrivers;
