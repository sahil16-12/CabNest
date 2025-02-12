import express from "express";
import { uploadFiles } from "../middlewares/multer.js";

import { 
    createRider, 
    getRiderById, 
    updateRider, 
    deleteRider 
} from "../controllers/rider.js";

const router = express.Router();

// Routes for Rider
router.post("/", uploadFiles, createRider);
router.put("/:id", uploadFiles, updateRider);
router.get("/:id",getRiderById);  // Get a rider by ID
router.delete("/:id",deleteRider);// Delete a rider profile

export default router;
