import express from "express";
import upload from "../middlewares/upload.js";
import { 
    createRider, 
    getRiderById, 
    updateRider, 
    deleteRider 
} from "../controllers/rider.js";

const router = express.Router();

// Routes for Rider
router.post("/",upload.single("profileImage"), createRider);     // Create a new rider with image upload
router.get("/:id",getRiderById);  // Get a rider by ID
router.put("/:id",upload.single("profileImage"), updateRider);   // Update rider details
router.delete("/:id",deleteRider);// Delete a rider profile

export default router;
