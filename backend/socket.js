import { Server } from "socket.io";
import { Driver } from "./models/Driver.js";

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Update with frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A driver connected:", socket.id);

    // Listen for driver location updates
    socket.on("updateLocation", async ({ driverId, latitude, longitude }) => {
      try {
        await Driver.findByIdAndUpdate(driverId, {
          currentLocation: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          lastLocationUpdate: new Date(),
        });

        console.log(`Updated location for driver ${driverId}`);
      } catch (error) {
        console.error("Error updating driver location:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A driver disconnected:", socket.id);
    });
  });
}
