const AvailableDrivers = ({ distance, duration, fare, onClose, onBook }) => {
  const drivers = [
    {
      _id: "67bef1dc363c13d183d79b01",
      name: "Rajesh Kumar",
      carModel: "Toyota Etios",
      license: "GJ05AB1234",
      fare: distance ? (distance * 10).toFixed(2) : "100.00",
      eta: "5 min",
      photo:
        "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      _id: "67bef1dc363c13d183d79b02",
      name: "Vikram Singh",
      carModel: "Maruti Suzuki Dzire",
      license: "GJ01CD5678",
      fare: distance ? (distance * 9.5).toFixed(2) : "95.00",
      eta: "7 min",
      photo:
        "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      _id: "67bef1dc363c13d183d79b03",
      name: "Anil Patel",
      carModel: "Honda City",
      license: "GJ03EF9012",
      fare: distance ? (distance * 12).toFixed(2) : "120.00",
      eta: "10 min",
      photo:
        "https://images.unsplash.com/photo-1590086782957-93c06ef21604?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ];

  return (
    <div className="relative w-full mt-4 p-4 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-blue-600">Available Rides</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {drivers.map((driver) => (
          <div
            key={driver._id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <img
                src={driver.photo}
                alt={driver.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="text-xl font-semibold">{driver.name}</h4>
                <p className="text-gray-600">{driver.carModel}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">License:</span> {driver.license}
              </p>
              <p className="text-lg text-green-600 font-bold">
                Fare: ₹{driver.fare}
              </p>
              <p className="text-sm">
                <span className="font-medium">ETA:</span> {driver.eta}
              </p>
            </div>
            <button
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              onClick={() => onBook(driver)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableDrivers;
