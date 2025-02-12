import express from "express";
import { 
    createDriver, 
    getAllDrivers, 
    getDriverById, 
    updateDriver, 
    deleteDriver 
} from "../controllers/driver.js";
import { uploadFiles } from "../middlewares/multer.js";

const router = express.Router();

// Routes
router.post("/" ,uploadFiles, createDriver);  // Create a driver with image upload
router.get("/", getAllDrivers);  // Get all drivers
router.get("/:id", getDriverById);  // Get driver by ID
router.put("/:id",  uploadFiles, updateDriver);  // Update driver details
router.delete("/:id", deleteDriver);  // Delete driver

export default router;
