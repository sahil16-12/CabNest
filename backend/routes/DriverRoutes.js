import express from "express";
import upload from "../middlewares/upload.js";
import { 
    createDriver, 
    getAllDrivers, 
    getDriverById, 
    updateDriver, 
    deleteDriver 
} from "../controllers/driver.controller.js";

const router = express.Router();

// Routes
router.post("/", upload.single("profileImage"), createDriver);  // Create a driver with image upload
router.get("/", getAllDrivers);  // Get all drivers
router.get("/:id", getDriverById);  // Get driver by ID
router.put("/:id", upload.single("profileImage"), updateDriver);  // Update driver details
router.delete("/:id", deleteDriver);  // Delete driver

export default router;
