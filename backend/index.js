import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import userRoutes from "./routes/userRoutes.js";
import DriverRoutes from "./routes/DriverRoutes.js";
import RiderRoutes from "./routes/RiderRoutes.js";
import AdminRoutes from "./routes/AdminRoutes.js";
import rideRoutes from "./routes/RideRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { createServer } from "http";
import { Driver } from "./models/Driver.js";
import Razorpay from "razorpay";
import notificationRoutes from "./routes/notificationRoutes.js";

// Configure environment variables
dotenv.config();

// Convert the module URL to a directory path

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});
// Initialize Express app
const app = express();
const server = createServer(app); // Create an HTTP server for Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update with frontend URL
    methods: ["GET", "POST"],
  },
});
const connectedUsers = new Map();
io.connectedUsers = connectedUsers;
io.on("connection", (socket) => {
  console.log("New Client connected:", socket.id);

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
  // Handle driver connection
  socket.on("register-driver", (driverId) => {
    connectedUsers.set(driverId.toString(), socket.id);
    console.log(`Driver ${driverId} connected`);
  });
  // Register rider socket
  socket.on("register-rider", (riderId) => {
    connectedUsers.set(riderId.toString(), socket.id);
    console.log(`Rider ${riderId} connected`);
  });
  socket.on("disconnect", () => {
    console.log("A driver disconnected:", socket.id);
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

app.set("io", io);

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => {
  res.send("Server is up and running...");
});
app.use("/api", userRoutes);
app.use("/api/rider", RiderRoutes);
app.use("/api/driver", DriverRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/ride", rideRoutes);
app.use("/api/notifications", notificationRoutes);

// const createAdminUser = async () => {
//   try {
//       const newAdmin = new User({
//           name: "Admin User",
//           email: "admin@example.com", // Replace with actual admin email
//           password: "hashed_password", // Make sure to hash the password before saving
//           role: "admin", // Set role to "admin"
//       });

//       await newAdmin.save();
//       console.log("Admin user created successfully.");
//   } catch (error) {
//       console.error("Error creating admin user:", error);
//   }
// }
// createAdminUser();
// Start the server

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
const port = process.env.PORT || 5000;
connectDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
