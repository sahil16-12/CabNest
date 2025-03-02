// import React, { useState, useEffect, useRef } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   useMapEvents,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import AvailableDrivers from "./AvailableDrivers";
// import { useNavigate } from "react-router-dom";
// import { UserData } from "../context/UserContext";
// import ProfilePage from "./ProfilePage";

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
//         // Set the pickup location if not already set
//         const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
//         setPickup(locationName);
//         setMarkers((prev) => ({ ...prev, pickup: e.latlng }));
//       } else if (!markers.drop) {
//         // Set the drop location if not already set
//         const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
//         setDrop(locationName);
//         setMarkers((prev) => ({ ...prev, drop: e.latlng }));
//       } else {
//         // If both pickup and drop are set, update the drop location
//         const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
//         setDrop(locationName);
//         setMarkers((prev) => ({ ...prev, drop: e.latlng }));
//       }
//     },
//   });
//   return null;
// };

// const RideBookPage = () => {
//   const [pickup, setPickup] = useState("");
//   const [drop, setDrop] = useState("");
//   const [markers, setMarkers] = useState({ pickup: null, drop: null });
//   const [distance, setDistance] = useState(null);
//   const [route, setRoute] = useState([]);
//   const [showDrivers, setShowDrivers] = useState(false);
//   const driversRef = useRef(null);
//   const navigate = useNavigate();
//   const { isAuth } = UserData();
//   const [showProfile, setShowProfile] = useState(false);
//   useEffect(() => {
//     if (markers.pickup && markers.drop) {
//       calculateDistance(markers.pickup, markers.drop);
//       fetchRoute(markers.pickup, markers.drop, setRoute);
//     }
//   }, [markers]);

//   const handleBookCab = () => {
//     if (!pickup) {
//       alert("Please select pickup location");
//       return;
//     }

//     if (!drop) {
//       alert("Please select drop location");
//       return;
//     }

//     setShowDrivers(true);

//     setTimeout(() => {
//       if (driversRef.current) {
//         driversRef.current.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//       }
//     }, 100);
//   };

//   const handleConfirmBooking = (driver) => {
//     navigate("/ride-request", { state: { driver, pickup, drop } });
//   };

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

//   const blueIcon = new L.Icon({
//     iconUrl:
//       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//     shadowUrl:
//       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//     iconSize: [30, 45],
//     iconAnchor: [15, 45],
//     popupAnchor: [1, -38],
//     shadowSize: [41, 41],
//   });

//   const handleMarkerDrag = (e, type) => {
//     const newLatLng = e.target.getLatLng();
//     if (type === "pickup") {
//       setMarkers((prev) => ({
//         ...prev,
//         pickup: { lat: newLatLng.lat, lng: newLatLng.lng },
//       }));
//       geocodeLatLng(newLatLng.lat, newLatLng.lng).then(setPickup);
//     } else if (type === "drop") {
//       setMarkers((prev) => ({
//         ...prev,
//         drop: { lat: newLatLng.lat, lng: newLatLng.lng },
//       }));
//       geocodeLatLng(newLatLng.lat, newLatLng.lng).then(setDrop);
//     }
//   };

//   if (!isAuth) {
//     navigate("/login");
//     return null;
//   }

//   return (
//     <>
//       {isAuth == true && (
//         <div className="min-h-screen flex flex-col bg-gray-50">
//           <header className="bg-gray-900 text-white p-6 flex items-center justify-between">
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold text-blue-400">CabNest</h1>
//             </div>
//           </header>

//           <div className="flex flex-col md:flex-row flex-grow p-6">
//             <div className="w-full md:w-1/3 p-6 bg-white shadow-lg rounded-lg">
//               <h2 className="text-2xl font-semibold text-blue-600 mb-6">
//                 Enter Trip Details
//               </h2>

//               <label className="block mb-2 text-gray-600">
//                 Pickup Location
//               </label>
//               <input
//                 type="text"
//                 value={pickup}
//                 onChange={(e) => handleLocationChange(e.target.value, "pickup")}
//                 className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter pickup location"
//               />

//               <button
//                 onClick={setPickupToCurrentLocation}
//                 className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mb-4"
//               >
//                 Set Pickup to Current Location
//               </button>

//               <div className="flex justify-center items-center my-4">
//                 <button
//                   onClick={swapLocations}
//                   className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
//                   title="Swap Locations"
//                 >
//                   ⇅
//                 </button>
//               </div>

//               <label className="block mb-2 text-gray-600">Drop Location</label>
//               <input
//                 type="text"
//                 value={drop}
//                 onChange={(e) => handleLocationChange(e.target.value, "drop")}
//                 className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter drop location"
//               />

//               <div className="mt-4 text-gray-700">
//                 <p className="text-lg">
//                   <strong>Total Distance:</strong>{" "}
//                   {distance ? `${distance} km` : "N/A"}
//                 </p>
//               </div>

//               <div className="mt-6">
//                 <div className="flex justify-between">
//                   <button
//                     onClick={clearMarkers}
//                     className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600"
//                   >
//                     Clear Map
//                   </button>

//                   <button
//                     onClick={handleBookCab}
//                     className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600"
//                   >
//                     Book a Cab
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="w-full md:w-2/3 p-6 flex justify-center items-center">
//               <div className="w-full h-[500px] bg-white rounded-lg shadow-xl overflow-hidden">
//                 <MapContainer
//                   center={center}
//                   zoom={12}
//                   style={{
//                     height: "100%",
//                     width: "100%",
//                     borderRadius: "12px",
//                   }}
//                 >
//                   <TileLayer
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                   />
//                   <MapEvents
//                     setMarkers={setMarkers}
//                     markers={markers}
//                     setPickup={setPickup}
//                     setDrop={setDrop}
//                   />
//                   {markers.pickup && (
//                     <Marker
//                       position={markers.pickup}
//                       icon={blueIcon}
//                       draggable={true}
//                       eventHandlers={{
//                         dragend: (e) => handleMarkerDrag(e, "pickup"),
//                       }}
//                     >
//                       <Popup>{pickup}</Popup>
//                     </Marker>
//                   )}
//                   {markers.drop && (
//                     <Marker
//                       position={markers.drop}
//                       icon={blueIcon}
//                       draggable={true}
//                       eventHandlers={{
//                         dragend: (e) => handleMarkerDrag(e, "drop"),
//                       }}
//                     >
//                       <Popup>{drop}</Popup>
//                     </Marker>
//                   )}
//                   {route.length > 0 && (
//                     <Polyline
//                       positions={route.map((point) => [point.lat, point.lng])}
//                       color="red"
//                       weight={3}
//                     />
//                   )}
//                 </MapContainer>
//               </div>
//             </div>
//           </div>

//           {showDrivers && (
//             <div
//               className="w-full p-6 bg-white shadow-lg rounded-lg mb-6"
//               ref={driversRef}
//             >
//               <AvailableDrivers
//                 distance={distance}
//                 onClose={() => setShowDrivers(false)}
//                 onBook={handleConfirmBooking}
//               />
//             </div>
//           )}

//           <footer className="bg-gray-900 text-white p-4 text-center">
//             <p className="text-lg">
//               © 2025 <span className="text-blue-400">CabNest</span>. All rights
//               reserved.
//             </p>
//           </footer>
//         </div>
//       )}
//     </>
//   );
// };

// export default RideBookPage;
import { useState, useEffect, useRef } from "react";
import { server } from "../main";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AvailableDrivers from "./AvailableDrivers";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";

const center = [22.3072, 73.1812]; // Default center

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
    const route = data.routes[0].geometry.coordinates.map(([lng, lat]) => ({
      lat,
      lng,
    }));
    setRoute(route);
    return {
      route,
      distance: data.routes[0].distance / 1000, // Convert meters to km
      duration: data.routes[0].duration, // Duration in seconds
    };
  }
  return null;
};

const MapEvents = ({ setMarkers, markers, setPickup, setDrop }) => {
  useMapEvents({
    click: async (e) => {
      if (!markers.pickup) {
        // Set the pickup location if not already set
        const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
        setPickup(locationName);
        setMarkers((prev) => ({ ...prev, pickup: e.latlng }));
      } else if (!markers.drop) {
        // Set the drop location if not already set
        const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
        setDrop(locationName);
        setMarkers((prev) => ({ ...prev, drop: e.latlng }));
      } else {
        // If both pickup and drop are set, update the drop location
        const locationName = await geocodeLatLng(e.latlng.lat, e.latlng.lng);
        setDrop(locationName);
        setMarkers((prev) => ({ ...prev, drop: e.latlng }));
      }
    },
  });
  return null;
};

const RideBookPage = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [markers, setMarkers] = useState({ pickup: null, drop: null });
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [fare, setFare] = useState(null);
  const [route, setRoute] = useState([]);
  const [showDrivers, setShowDrivers] = useState(false);
  const [loading, setLoading] = useState(false);
  const driversRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuth } = UserData();

  useEffect(() => {
    if (markers.pickup && markers.drop) {
      calculateRoute();
    }
  }, [markers]);

  const calculateRoute = async () => {
    if (!markers.pickup || !markers.drop) return;

    try {
      setLoading(true);
      const routeData = await fetchRoute(
        markers.pickup,
        markers.drop,
        setRoute
      );

      if (routeData) {
        setDistance(routeData.distance.toFixed(2));
        setDuration(routeData.duration);

        // Calculate fare (basic algorithm)
        const baseFare = 40;
        const perKmRate = 5;
        const perMinuteRate = 0.5;

        const distanceCost = routeData.distance * perKmRate;
        const timeCost = (routeData.duration / 60) * perMinuteRate;

        const calculatedFare = Math.round(baseFare + distanceCost + timeCost);
        setFare(calculatedFare);
      } else {
        // Fallback to direct distance calculation if route API fails
        calculateDirectDistance(markers.pickup, markers.drop);
      }
    } catch (error) {
      console.error("Failed to fetch route:", error);
      calculateDirectDistance(markers.pickup, markers.drop);
    } finally {
      setLoading(false);
    }
  };

  const calculateDirectDistance = (pickupLatLng, dropLatLng) => {
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

    // Estimate duration (assuming 30 km/h average speed)
    const estimatedDuration = (distanceInKm / 30) * 3600; // in seconds
    setDuration(Math.round(estimatedDuration));

    // Calculate fare
    const baseFare = 50;
    const perKmRate = 10;
    const estimatedFare = Math.round(baseFare + distanceInKm * perKmRate);
    setFare(estimatedFare);
  };

  const handleBookCab = () => {
    if (!pickup) {
      toast.error("Please select pickup location");
      return;
    }

    if (!drop) {
      toast.error("Please select drop location");
      return;
    }

    if (!distance) {
      toast.error("Unable to calculate route distance");
      return;
    }

    setShowDrivers(true);

    setTimeout(() => {
      if (driversRef.current) {
        driversRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleConfirmBooking = async (driver) => {
    try {
      setLoading(true);

      // Prepare ride data
      const rideData = {
        riderId: user._id,
        driverId: driver._id,
        pickup: {
          address: pickup,
          coordinates: [markers.pickup.lng, markers.pickup.lat],
        },
        drop: {
          address: drop,
          coordinates: [markers.drop.lng, markers.drop.lat],
        },
        distance: parseFloat(distance),
        rideType: "standard",
      };

      // Call the API to create ride request
      const response = await axios.post(
        `${server}/api/ride/request`,
        rideData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Response of ride request is : ", response);

      if (response.data.success) {
        toast.success("Ride booked successfully!");
        navigate("/ride-request", {
          state: {
            ride: response.data.ride,
            driver,
          },
        });
      }
    } catch (error) {
      console.error("Error booking ride:", error);
      toast.error(error.response?.data?.message || "Failed to book ride");
    } finally {
      setLoading(false);
    }
  };

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
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handleLocationChange = async (value, type) => {
    if (type === "pickup") {
      setPickup(value);
      if (value.trim().length > 3) {
        const latLng = await geocodeLocation(value);
        if (latLng) {
          setMarkers((prev) => ({ ...prev, pickup: latLng }));
        }
      }
    } else if (type === "drop") {
      setDrop(value);
      if (value.trim().length > 3) {
        const latLng = await geocodeLocation(value);
        if (latLng) {
          setMarkers((prev) => ({ ...prev, drop: latLng }));
        }
      }
    }
  };

  const clearMarkers = () => {
    setMarkers({ pickup: null, drop: null });
    setPickup("");
    setDrop("");
    setDistance(null);
    setDuration(null);
    setFare(null);
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

  const blueIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [1, -38],
    shadowSize: [41, 41],
  });

  const handleMarkerDrag = (e, type) => {
    const newLatLng = e.target.getLatLng();
    if (type === "pickup") {
      setMarkers((prev) => ({
        ...prev,
        pickup: { lat: newLatLng.lat, lng: newLatLng.lng },
      }));
      geocodeLatLng(newLatLng.lat, newLatLng.lng).then(setPickup);
    } else if (type === "drop") {
      setMarkers((prev) => ({
        ...prev,
        drop: { lat: newLatLng.lat, lng: newLatLng.lng },
      }));
      geocodeLatLng(newLatLng.lat, newLatLng.lng).then(setDrop);
    }
  };

  if (!isAuth) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gray-900 text-white p-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link to={"/"} className="text-2xl font-bold text-blue-400">
            CabNest
          </Link>
        </div>
        <div className="flex items-center">
          <span className="mr-3">{user?.name}</span>
          <button
            onClick={() => navigate("/rider-profile")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Profile
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-grow p-6">
        <div className="w-full md:w-1/3 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">
            Enter Trip Details
          </h2>

          <label className="block mb-2 text-gray-600">Pickup Location</label>
          <input
            type="text"
            value={pickup}
            onChange={(e) => handleLocationChange(e.target.value, "pickup")}
            className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter pickup location"
          />

          <button
            onClick={setPickupToCurrentLocation}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mb-4"
          >
            Set Pickup to Current Location
          </button>

          <div className="flex justify-center items-center my-4">
            <button
              onClick={swapLocations}
              className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
              title="Swap Locations"
            >
              ⇅
            </button>
          </div>

          <label className="block mb-2 text-gray-600">Drop Location</label>
          <input
            type="text"
            value={drop}
            onChange={(e) => handleLocationChange(e.target.value, "drop")}
            className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter drop location"
          />

          <div className="mt-4 text-gray-700 space-y-2">
            <p className="text-lg">
              <strong>Total Distance:</strong>{" "}
              {distance ? `${distance} km` : "N/A"}
            </p>
            <p className="text-lg">
              <strong>Estimated Duration:</strong>{" "}
              {duration ? `${Math.floor(duration / 60)} min` : "N/A"}
            </p>
            <p className="text-lg">
              <strong>Estimated Fare:</strong> {fare ? `₹${fare}` : "N/A"}
            </p>
          </div>

          <div className="mt-6">
            <div className="flex justify-between">
              <button
                onClick={clearMarkers}
                className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 disabled:bg-gray-400"
                disabled={loading}
              >
                Clear Map
              </button>

              <button
                onClick={handleBookCab}
                className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 disabled:bg-gray-400"
                disabled={loading || !distance}
              >
                {loading ? "Processing..." : "Book a Cab"}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 p-6 flex justify-center items-center">
          <div className="w-full h-[500px] bg-white rounded-lg shadow-xl overflow-hidden">
            <MapContainer
              center={center}
              zoom={12}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "12px",
              }}
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
                  icon={blueIcon}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => handleMarkerDrag(e, "pickup"),
                  }}
                >
                  <Popup>{pickup}</Popup>
                </Marker>
              )}
              {markers.drop && (
                <Marker
                  position={markers.drop}
                  icon={blueIcon}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => handleMarkerDrag(e, "drop"),
                  }}
                >
                  <Popup>{drop}</Popup>
                </Marker>
              )}
              {route.length > 0 && (
                <Polyline
                  positions={route.map((point) => [point.lat, point.lng])}
                  color="red"
                  weight={3}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>

      {showDrivers && (
        <div
          className="w-full p-6 bg-white shadow-lg rounded-lg mb-6"
          ref={driversRef}
        >
          <AvailableDrivers
            distance={distance}
            duration={duration}
            fare={fare}
            pickup={markers.pickup}
            drop={markers.drop}
            onClose={() => setShowDrivers(false)}
            onBook={handleConfirmBooking}
          />
        </div>
      )}

      <footer className="bg-gray-900 text-white p-4 text-center">
        <p className="text-lg">
          © 2025 <span className="text-blue-400">CabNest</span>. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default RideBookPage;
