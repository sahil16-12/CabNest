// import React, { useState, useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   useMapEvents,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// const center = [22.3072, 73.1812]; // Default center

// const geocodeLatLng = async (lat, lng) => {
//   const response = await fetch(
//     `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//   );
//   const data = await response.json();
//   if (data && data.display_name) {
//     return data.display_name;
//   }
//   return "";
// };

// const geocodeLocation = async (location) => {
//   const response = await fetch(
//     `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
//   );
//   const data = await response.json();
//   if (data && data.length > 0) {
//     return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
//   }
//   return null;
// };

// const fetchRoute = async (pickup, drop, setRoute) => {
//   const response = await fetch(
//     `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}?geometries=geojson`
//   );
//   const data = await response.json();
//   if (data && data.routes && data.routes[0] && data.routes[0].geometry) {
//     setRoute(
//       data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }))
//     );
//   }
// };

// const MapEvents = ({ setMarkers, markers, setPickup, setDrop }) => {
//   useMapEvents({
//     click: async (e) => {
//       if (!markers.pickup) {
//         const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
//         setPickup(locationName);
//         setMarkers((prev) => ({ ...prev, pickup: e.latlng }));
//       } else if (!markers.drop) {
//         const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
//         setDrop(locationName);
//         setMarkers((prev) => ({ ...prev, drop: e.latlng }));
//       }
//     },
//   });
//   return null;
// };

// const HomePage = () => {
//   const [pickup, setPickup] = useState("");
//   const [drop, setDrop] = useState("");
//   const [markers, setMarkers] = useState({ pickup: null, drop: null });
//   const [distance, setDistance] = useState(null);
//   const [route, setRoute] = useState([]);

//   useEffect(() => {
//     if (markers.pickup && markers.drop) {
//       calculateDistance(markers.pickup, markers.drop);
//       fetchRoute(markers.pickup, markers.drop, setRoute);
//     }
//   }, [markers]);

//   const setPickupToCurrentLocation = async () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude, longitude } = position.coords;
//         const locationName = await geocodeLatLng(latitude, longitude);
//         setPickup(locationName);
//         setMarkers((prev) => ({
//           ...prev,
//           pickup: { lat: latitude, lng: longitude },
//         }));
//       });
//     } else {
//       alert("Geolocation is not supported by your browser.");
//     }
//   };

//   const calculateDistance = (pickupLatLng, dropLatLng) => {
//     const R = 6371; // Radius of the Earth in km
//     const dLat = ((dropLatLng.lat - pickupLatLng.lat) * Math.PI) / 180;
//     const dLng = ((dropLatLng.lng - pickupLatLng.lng) * Math.PI) / 180;

//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((pickupLatLng.lat * Math.PI) / 180) *
//         Math.cos((dropLatLng.lat * Math.PI) / 180) *
//         Math.sin(dLng / 2) *
//         Math.sin(dLng / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distanceInKm = R * c;
//     setDistance(distanceInKm.toFixed(2));
//   };

//   const handleLocationChange = async (value, type) => {
//     if (type === "pickup") {
//       setPickup(value);
//       const latLng = await geocodeLocation(value);
//       if (latLng) {
//         setMarkers((prev) => ({ ...prev, pickup: latLng }));
//       }
//     } else if (type === "drop") {
//       setDrop(value);
//       const latLng = await geocodeLocation(value);
//       if (latLng) {
//         setMarkers((prev) => ({ ...prev, drop: latLng }));
//       }
//     }
//   };

//   const clearMarkers = () => {
//     setMarkers({ pickup: null, drop: null });
//     setPickup("");
//     setDrop("");
//     setDistance(null);
//     setRoute([]);
//   };

//   const swapLocations = () => {
//     const tempPickup = pickup;
//     const tempPickupMarker = markers.pickup;
//     setPickup(drop);
//     setMarkers((prev) => ({
//       ...prev,
//       pickup: prev.drop,
//       drop: tempPickupMarker,
//     }));
//     setDrop(tempPickup);
//   };

//   return (
//     <div className="h-screen flex flex-col bg-gray-100">
//       <div className="flex-grow flex flex-col md:flex-row">
//         <div className="w-full md:w-1/3 p-6 bg-white shadow-md">
//           <h2 className="text-xl font-semibold text-blue-700 mb-4">
//             Enter Your Trip Details
//           </h2>

//           <label className="block mb-2 text-gray-700">Pickup Location</label>
//           <input
//             type="text"
//             value={pickup}
//             onChange={(e) => handleLocationChange(e.target.value, "pickup")}
//             className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-blue-500"
//             placeholder="Enter pickup location"
//           />

//           <button
//             onClick={setPickupToCurrentLocation}
//             className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mb-4 w-full"
//           >
//             Set Pickup to Current Location
//           </button>

//           <div className="flex justify-center items-center my-4">
//             <button
//               onClick={swapLocations}
//               className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
//               title="Swap Locations"
//             >
//               ⇅
//             </button>
//           </div>

//           <label className="block mb-2 text-gray-700">Drop Location</label>
//           <input
//             type="text"
//             value={drop}
//             onChange={(e) => handleLocationChange(e.target.value, "drop")}
//             className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-blue-500"
//             placeholder="Enter drop location"
//           />

//           <div className="mt-4 text-gray-700">
//             <p>Total Distance: {distance ? `${distance} km` : "N/A"}</p>
//           </div>

//           <div className="mt-6">
//             <div className="flex justify-between">
//               <button
//                 onClick={clearMarkers}
//                 className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600"
//               >
//                 Clear Map
//               </button>

//               <button
//                 onClick={() => alert("Searching for a cab...")}
//                 className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600"
//               >
//                 Book a Cab
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="w-full md:w-2/3 flex justify-center items-center p-6">
//           <div
//             className="w-full h-[500px] bg-white rounded-lg shadow-lg overflow-hidden"
//             style={{ maxWidth: "800px" }}
//           >
//             <MapContainer
//               center={center}
//               zoom={5}
//               style={{ height: "100%", width: "100%", borderRadius: "12px" }}
//             >
//               <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//               />
//               <MapEvents
//                 setMarkers={setMarkers}
//                 markers={markers}
//                 setPickup={setPickup}
//                 setDrop={setDrop}
//               />
//               {markers.pickup && (
//                 <Marker
//                   position={markers.pickup}
//                   icon={L.icon({
//                     iconUrl:
//                       "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//                     iconSize: [25, 41],
//                   })}
//                 />
//               )}
//               {markers.drop && (
//                 <Marker
//                   position={markers.drop}
//                   icon={L.icon({
//                     iconUrl:
//                       "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//                     iconSize: [25, 41],
//                   })}
//                 />
//               )}
//               {route.length > 0 && (
//                 <Polyline
//                   positions={route.map((point) => [point.lat, point.lng])}
//                   color="blue"
//                 />
//               )}
//             </MapContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import TaxiLoader from "./TaxiLoader"; // A component for the loader animation

const center = [22.3072, 73.1812]; // Vadodara city coordinates

const geocodeLatLng = async (lat, lng) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
  const data = await response.json();
  if (data && data.display_name) {
    return data.display_name;
  }
  return "";
};

const geocodeLocation = async (location) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
  );
  const data = await response.json();
  if (data && data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
};

const fetchRoute = async (pickup, drop, setRoute) => {
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}?geometries=geojson`
  );
  const data = await response.json();
  if (data && data.routes && data.routes[0] && data.routes[0].geometry) {
    setRoute(
      data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }))
    );
  }
};

const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click: async (e) => {
      if (!markers.pickup) {
        const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
        setPickup(locationName);
        setMarkers((prev) => ({ ...prev, pickup: e.latlng }));
      } else if (!markers.drop) {
        const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
        setDrop(locationName);
        setMarkers((prev) => ({ ...prev, drop: e.latlng }));
      }
    },
  });
  return null;
};

const CabBookingMap = () => {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (markers.pickup && markers.drop) {
      calculateDistance(markers.pickup, markers.drop);
      fetchRoute(markers.pickup, markers.drop, setRoute);
    }
  }, [markers]);

  const setPickupToCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const locationName = await geocodeLatLng(latitude, longitude);
        setPickup(locationName);
        setMarkers((prev) => ({
          ...prev,
          pickup: { lat: latitude, lng: longitude },
        }));
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const calculateDistance = (pickupLatLng, dropLatLng) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((dropLatLng.lat - pickupLatLng.lat) * Math.PI) / 180;
    const dLng = ((dropLatLng.lng - pickupLatLng.lng) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pickupLatLng.lat * Math.PI) / 180) *
        Math.cos((dropLatLng.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInKm = R * c;
    setDistance(distanceInKm.toFixed(2));
  };

  const handleLocationChange = async (value, type) => {
    if (type === "pickup") {
      setPickup(value);
      const latLng = await geocodeLocation(value);
      if (latLng) {
        setMarkers((prev) => ({ ...prev, pickup: latLng }));
      }
    } else if (type === "drop") {
      setDrop(value);
      const latLng = await geocodeLocation(value);
      if (latLng) {
        setMarkers((prev) => ({ ...prev, drop: latLng }));
      }
    }
  };

  const clearMarkers = () => {
    setMarkers({ pickup: null, drop: null });
    setPickup("");
    setDrop("");
    setDistance(null);
    setRoute([]);
  };

  const swapLocations = () => {
    const tempPickup = pickup;
    const tempPickupMarker = markers.pickup;
    setPickup(drop);
    setMarkers((prev) => ({
      ...prev,
      pickup: prev.drop,
      drop: tempPickupMarker,
    }));
    setDrop(tempPickup);
  };

  const bookCab = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/select-cab", { state: { drivers: mockDrivers } });
    }, 3000); // Simulate searching for a cab
  };

  const mockDrivers = [
    {
      id: 1,
      name: "John Doe",
      car: "Toyota Prius",
      rating: 4.5,
      distance: "1.2 km",
    },
    {
      id: 2,
      name: "Jane Smith",
      car: "Honda Civic",
      rating: 4.8,
      distance: "1.8 km",
    },
    {
      id: 3,
      name: "Michael Brown",
      car: "Hyundai Elantra",
      rating: 4.7,
      distance: "2.5 km",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <TaxiLoader />
        </div>
      )}

      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 px-8 shadow-md">
        <h1 className="text-3xl font-bold text-center">
          CabNest - Book Your Ride
        </h1>
      </header>

      <main className="flex flex-grow flex-col md:flex-row p-6">
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-6 mb-6 md:mb-0">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
            Enter Trip Details
          </h2>

          <label className="block mb-2 font-medium text-gray-700">
            Pickup Location
          </label>
          <input
            type="text"
            value={pickup}
            onChange={(e) => handleLocationChange(e.target.value, "pickup")}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder="Enter pickup location"
          />

          <button
            onClick={setPickupToCurrentLocation}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mb-4"
          >
            Use Current Location
          </button>

          <label className="block mb-2 font-medium text-gray-700">
            Drop Location
          </label>
          <input
            type="text"
            value={drop}
            onChange={(e) => handleLocationChange(e.target.value, "drop")}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder="Enter drop location"
          />

          <div className="text-center my-4">
            <button
              onClick={swapLocations}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-300"
            >
              ⇅ Swap Locations
            </button>
          </div>

          <p className="text-lg font-medium text-gray-700">
            Total Distance: {distance ? `${distance} km` : "N/A"}
          </p>

          <div className="mt-6 flex justify-between">
            <button
              onClick={clearMarkers}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Clear Map
            </button>
            <button
              onClick={bookCab}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              Book a Cab
            </button>
          </div>
        </div>

        <div className="w-full md:w-2/3 flex justify-center items-center">
          <div className="w-full h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
            <MapContainer
              center={center}
              zoom={14} // Improved zoom level for clarity
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true} // Enable smooth zooming
              zoomControl={true} // Show zoom controls
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapEvents
                setMarkers={setMarkers}
                markers={markers}
                setPickup={setPickup}
                setDrop={setDrop}
              />
              {markers.pickup && (
                <Marker
                  position={markers.pickup}
                  icon={L.icon({
                    iconUrl:
                      "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                    iconSize: [35, 50],
                  })}
                />
              )}
              {markers.drop && (
                <Marker
                  position={markers.drop}
                  icon={L.icon({
                    iconUrl:
                      "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                    iconSize: [35, 50],
                  })}
                />
              )}
              {route.length > 0 && (
                <Polyline
                  positions={route.map((point) => [point.lat, point.lng])}
                  color="blue"
                  weight={6} // Improved route line thickness for visibility
                  opacity={0.7} // Make the route semi-transparent for aesthetics
                />
              )}
            </MapContainer>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>© 2025 CabNest. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CabBookingMap;
