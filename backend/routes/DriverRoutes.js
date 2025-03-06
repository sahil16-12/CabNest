import express from "express";
import {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} from "../controllers/driver.js";
import { uploadFiles } from "../middlewares/multer.js";
import {
  getEarnings,
  getRating,
  getStatus,
  getTotalDistance,
  updateStatus,
} from "../controllers/driverDashboard.js";

const router = express.Router();

// Routes
router.get("/available", getAllDrivers); // Get all drivers
router.post("/", uploadFiles, createDriver); // Create a driver with image upload
router.get("/:id", getDriverById); // Get driver by ID
router.put("/:id", uploadFiles, updateDriver); // Update driver details
router.delete("/:id", deleteDriver); // Delete driver
router.get("/earnings/:id", getEarnings);
router.get("/rating/:id", getRating);
router.get("/status/:id", getStatus);
router.put("/status/:id", updateStatus);
router.get("/total-distance/:id", getTotalDistance);
export default router;
