import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  MapPin,
  DollarSign,
  Users,
  Navigation,
  Car,
  ArrowUpRight,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DriverDashboard = () => {
  const [earnings, setEarnings] = useState(87.5);
  const [completedRides, setCompletedRides] = useState(5);
  const [totalDistance, setTotalDistance] = useState(42.7);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 22.3072,
    lng: 73.1812,
  });
  const [weeklyEarnings, setWeeklyEarnings] = useState([
    { day: "Mon", amount: 65 },
    { day: "Tue", amount: 75 },
    { day: "Wed", amount: 90 },
    { day: "Thu", amount: 55 },
    { day: "Fri", amount: 87.5 },
    { day: "Sat", amount: 120 },
    { day: "Sun", amount: 0 },
  ]);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

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
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([currentLocation.lat, currentLocation.lng]);
      mapInstanceRef.current.panTo([currentLocation.lat, currentLocation.lng]);
    }
  }, [currentLocation]);

  useEffect(() => {
    const getLocation = () => {
      const randomLat = currentLocation.lat + (Math.random() - 0.5) * 0.005;
      const randomLng = currentLocation.lng + (Math.random() - 0.5) * 0.005;
      setCurrentLocation({ lat: randomLat, lng: randomLng });
    };

    const interval = setInterval(getLocation, 10000);
    return () => clearInterval(interval);
  }, [currentLocation]);

  const maxEarning = Math.max(...weeklyEarnings.map((day) => day.amount));

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <main className="px-6 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-blue-100 text-sm font-medium">
                    Today&apos;s Earnings
                  </h3>
                  <p className="text-3xl font-bold mt-2">
                    ₹{earnings.toFixed(2)}
                  </p>
                  <span className="text-blue-100 text-sm flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    12% more than yesterday
                  </span>
                </div>
                <div className="p-3 rounded-full bg-blue-400 bg-opacity-30">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Completed Rides
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {completedRides}
                  </p>
                  <span className="text-green-500 text-sm flex items-center mt-2">
                    <Check className="h-4 w-4 mr-1" />
                    All rides rated 5 stars
                  </span>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Distance Traveled
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {totalDistance} <span className="text-lg">mi</span>
                  </p>
                  <span className="text-blue-600 text-sm flex items-center mt-2">
                    <Navigation className="h-4 w-4 mr-1" />
                    Today&apos;s activity
                  </span>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Car className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Earnings Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Weekly Earnings
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                View Details <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="h-64">
              <div className="flex items-end h-48 space-x-8 px-4">
                {weeklyEarnings.map((day, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className={`w-full rounded-t-lg ${
                        day.day === "Fri" ? "bg-blue-600" : "bg-blue-400"
                      }`}
                      style={{
                        height: `${(day.amount / maxEarning) * 100}%`,
                        minHeight: day.amount > 0 ? "10%" : "1%",
                      }}
                    ></div>
                    <p className="text-xs font-medium text-gray-600 mt-2">
                      {day.day}
                    </p>
                    <p
                      className={`text-xs ${
                        day.day === "Fri"
                          ? "font-bold text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      ₹{day.amount}
                    </p>
                  </div>
                ))}
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
