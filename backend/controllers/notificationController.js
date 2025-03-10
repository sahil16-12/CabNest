// controllers/notificationController.js
import { Notification } from "../models/Notification.js";
import { Ride } from "../models/Ride.js";

export const respondToRideRequest = async (req, res) => {
  try {
    const { notificationId, response } = req.params;
    const { driver } = req.body; // Authenticated driver

    const notification = await Notification.findById(notificationId)
      .populate("ride")
      .populate("sender")
      .populate({
        path: "recipient",
        populate: {
          path: "_id",
          model: "User",
        },
      });

    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    // Update notification and ride status
    notification.status = response;
    await notification.save();

    const ride = await Ride.findById(notification.ride._id);
    ride.status = response === "accepted" ? "accepted" : "canceled";
    await ride.save();

    let otp = null;
    if (response === "accepted") {
      // Generate a 6-digit OTP for ride pickup
      otp = Math.floor(100000 + Math.random() * 900000);
    }

    // Emit real-time response to rider
    const io = req.app.get("io");

    const riderSocketId = io.connectedUsers.get(
      notification.sender._id.toString()
    );
    if (riderSocketId) {
      io.to(riderSocketId).emit("ride-request-response", {
        ...notification.toObject(),
        response,
        otp,
        ride: ride.toObject(),
      });
    }

    res.json({ message: `Ride ${response} successfully`, otp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
