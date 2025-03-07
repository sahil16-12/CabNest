import React, { useRef, useEffect } from "react";
import {
  MapPin,
  DollarSign,
  Navigation,
  Car,
  ArrowUpRight,
  User,
  Power,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDriverDashboardC } from "../context/DriverDashboardContext.";

const DriverDashboard = () => {
  // Use the driver dashboard context
  const {
    earnings,
    totalDistance,
    overallRating,
    currentLocation,
    isAvailable,
    toggleAvailability,
    isLoading,
  } = useDriverDashboardC();

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize the map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [currentLocation.lat, currentLocation.lng],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: rgba(37, 99, 235, 0.2); width: 48px; height: 48px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                <div style="background-color: rgba(37, 99, 235, 0.4); width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                  <div style="color: rgb(37, 99, 235); transform: translate(0, -4px);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                </div>
              </div>`,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      markerRef.current = L.marker([currentLocation.lat, currentLocation.lng], {
        icon: customIcon,
      })
        .addTo(mapInstanceRef.current)
        .bindPopup("Your current location");

      const zoomControl = L.control.zoom({
        position: "topleft",
      });
      zoomControl.addTo(mapInstanceRef.current);

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, [currentLocation]);

  // Update the map marker and pan to the new location
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([currentLocation.lat, currentLocation.lng]);
      mapInstanceRef.current.panTo([currentLocation.lat, currentLocation.lng]);
    }
  }, [currentLocation]);

  // Show loading state
  // if (isLoading) {
  //   return (
  //     <div className="flex h-screen bg-gray-100 items-center justify-center">
  //       <div className="text-xl font-bold text-gray-800">Loading...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 overflow-auto">
        <main className="px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Driver Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleAvailability}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  isAvailable
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                <Power className="h-4 w-4 mr-2" />
                {isAvailable ? "Available" : "Unavailable"}
              </button>
              <a
                href="/profile-page"
                className="flex items-center px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Daily Earnings */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Daily Earnings
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    ₹{earnings.daily.toFixed(2)}
                  </p>
                  <span className="text-green-500 text-sm flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    12% more than yesterday
                  </span>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Weekly Earnings */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Weekly Earnings
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    ₹{earnings.weekly.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Monthly Earnings */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Monthly Earnings
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    ₹{earnings.monthly.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Total Distance Covered */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Total Distance
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {totalDistance} <span className="text-lg">mi</span>
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Car className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Overall Rating */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Overall Rating
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {overallRating}/5
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Navigation className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Live Location
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-gray-600">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Live Tracking
                  </span>
                  <button className="text-sm text-blue-600 hover:text-blue-800 py-1 px-3 rounded-lg hover:bg-blue-50">
                    Refresh
                  </button>
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-blue-600 mr-1" />
                <span>
                  Current: New York City ({currentLocation.lat.toFixed(4)}°N,{" "}
                  {currentLocation.lng.toFixed(4)}°W)
                </span>
              </div>
            </div>

            <div className="h-64 relative" ref={mapRef} style={{ zIndex: 0 }}>
              {/* The map will be rendered here */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;
