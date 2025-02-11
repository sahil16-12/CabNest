import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultPosition = [22.3039, 70.8022]; // Default location (Rajkot, Gujarat)

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const CabBookingMap = () => {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);

  const getAddress = async (lat, lng, setLocation) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      setLocation({ lat, lng, address: data.display_name });
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const fetchRoute = async () => {
    if (!pickup || !dropoff) return;
    try {
      const response = await fetch(
        `http://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      if (data.routes.length > 0) {
        setRoute(
          data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
        );
        setDistance((data.routes[0].distance / 1000).toFixed(2)); // Convert meters to km
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <div>
      <h2>Cab Booking Map</h2>
      <MapContainer
        center={defaultPosition}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker
          setPosition={(latlng) => getAddress(latlng[0], latlng[1], setPickup)}
        />
        <LocationMarker
          setPosition={(latlng) => getAddress(latlng[0], latlng[1], setDropoff)}
        />
        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]} icon={markerIcon}>
            <Popup>Pickup: {pickup.address}</Popup>
          </Marker>
        )}
        {dropoff && (
          <Marker position={[dropoff.lat, dropoff.lng]} icon={markerIcon}>
            <Popup>Drop-off: {dropoff.address}</Popup>
          </Marker>
        )}
        {route && <Polyline positions={route} color="blue" />}
      </MapContainer>
      <button onClick={fetchRoute} disabled={!pickup || !dropoff}>
        Get Route
      </button>
      <p>Distance: {distance ? `${distance} km` : "N/A"}</p>
    </div>
  );
};

export default CabBookingMap;
