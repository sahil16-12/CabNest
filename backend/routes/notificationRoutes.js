import express from "express";
import { respondToRideRequest } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/:notificationId/:response", respondToRideRequest);

export default router;
