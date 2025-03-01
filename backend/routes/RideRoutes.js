import express from "express";
const router = express.Router();
import {
  requestRide,
  getRideStatus,
  updateRideStatus,
  getRiderRides,
  getDriverRides,
  rateRide,
} from "../controllers/rideController.js";
import { checkout, paymentVerification } from "../controllers/payment.js";

// Create a new ride request
router.post("/request", requestRide);

// Get a specific ride's status
router.get("/:rideId", getRideStatus);

// Update a ride's status
router.put("/:rideId/status", updateRideStatus);

// Get all rides for a specific rider
router.get("/rider/:riderId", getRiderRides);

// Get all rides for a specific driver
router.get("/driver/:driverId", getDriverRides);

// Rate a completed ride
router.post("/:rideId/rate", rateRide);

router.post("/checkout/:id",checkout);

router.post("/verification/:id",paymentVerification)
export default router;
