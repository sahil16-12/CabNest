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
  updateEarnings,
  updateRating,
  updateStatus,
  updateTotalDistance,
} from "../controllers/driverDashboard.js";

const router = express.Router();

// Routes
router.get("/available", getAllDrivers); // Get all drivers
router.post("/", uploadFiles, createDriver); // Create a driver with image upload
router.get("/:id", getDriverById); // Get driver by ID
router.put("/:id", uploadFiles, updateDriver); // Update driver details
router.delete("/:id", deleteDriver); // Delete driver
router.get("/:id/earnings", getEarnings); // Get earnings data
router.post("/:id/update-earnings", updateEarnings); // Update earnings with a new payment
router.get("/:id/rating", getRating); // Get average rating
router.post("/:id/update-rating", updateRating); // Update rating with a new rating
router.get("/:id/status", getStatus); // Get driver status
router.post("/:id/update-status", updateStatus); // Update driver status
router.get("/:id/total-distance", getTotalDistance); // Get total distance
router.post("/:id/update-distance", updateTotalDistance); 
export default router;
