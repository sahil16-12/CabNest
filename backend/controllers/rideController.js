import { Rider } from "../models/Rider.js";
import { Driver } from "../models/Driver.js";
import { Ride } from "../models/Ride.js";
import { Notification } from "../models/Notification.js";

export const createRideRequest = async (req, res) => {
  try {
    const {
      riderId,
      driverId,
      pickup,
      drop,
      distance,
      fare,
      duration,
      rideType,
      ridername,
    } = req.body;

    // Create ride

    const newRide = new Ride({
      riderId,
      driverId,
      status: "requested",
      fare,
      paymentStatus: "pending",
      distance,
      duration,
      pickup,
      drop,
      rideType,
    });
    await newRide.save();
    // Create notification
    const notification = new Notification({
      sender: riderId,
      recipient: driverId,
      recipientType: "Driver",
      message: `New ride request from ${ridername}`,
      type: "ride_request",
      ride: newRide._id,
      status: "pending",
    });
    await notification.save();

    const io = req.app.get("io");

    const driverSocketId = io.connectedUsers.get(driverId.toString());

    notification.rideData = newRide;
    if (driverSocketId) {
      io.to(driverSocketId).emit("new-ride-request", {
        ...notification.toObject(),
        ride: newRide,
      });
    }

    res.status(201).json({ notification, ride: newRide });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;

    // First, fetch the ride with basic user information
    const ride = await Ride.findById(rideId)
      .populate("riderId", "name email")
      .populate(
        "driverId",
        "fullName phoneNumber vehicleName licenseNumber plateNumber"
      );

    // Then separately get the phone numbers
    const riderPhone = await Rider.findOne(
      { userId: ride.riderId._id },
      "phoneNumber"
    );

    // Add the phone numbers to the populated objects
    if (ride.riderId && riderPhone) {
      ride.riderId.phoneNumber = riderPhone.phoneNumber;
    }

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    return res.status(200).json({
      success: true,
      ride,
    });
  } catch (error) {
    console.error("Error getting ride status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get ride status",
      error: error.message,
    });
  }
};

export const updateRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { status, driverId } = req.body;

    const validStatuses = [
      "requested",
      "accepted",
      "in-progress",
      "completed",
      "canceled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ride status",
      });
    }

    const updateData = { status };

    // If driver is being assigned
    if (status === "accepted" && driverId) {
      updateData.driverId = driverId;
      await Driver.findByIdAndUpdate(driverId, { status: "busy" });
    }

    // If ride is completed
    if (status === "completed") {
      updateData.actualDropTime = new Date();
    }

    // If ride is started
    if (status === "in-progress") {
      updateData.actualPickupTime = new Date();
    }

    const updatedRide = await Ride.findByIdAndUpdate(rideId, updateData, {
      new: true,
    });

    if (!updatedRide) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    // If ride is completed or canceled, free up the driver
    if (status === "completed" || status === "canceled") {
      if (updatedRide.driverId) {
        await Driver.findByIdAndUpdate(updatedRide.driverId, {
          status: "online",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Ride status updated to ${status}`,
      ride: updatedRide,
    });
  } catch (error) {
    console.error("Error updating ride status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update ride status",
      error: error.message,
    });
  }
};

export const getRiderRides = async (req, res) => {
  try {
    const { riderId } = req.params;

    const rides = await Ride.find({ riderId })
      .populate(
        "driverId",
        "fullName phoneNumber vehicleName licenseNumber plateNumber"
      )
      .sort({ requestedTime: -1 });

    return res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    console.error("Error getting rider rides:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get rider rides",
      error: error.message,
    });
  }
};

export const getDriverRides = async (req, res) => {
  try {
    const { driverId } = req.params;

    const rides = await Ride.find({ driverId })
      .populate("riderId", "fullName phoneNumber")
      .sort({ requestedTime: -1 });

    const riderEmail = await Driver.findOne(
      { userId: rides.riderId._id },
      "email"
    );

    if (rides.riderId && riderEmail) {
      rides.riderId.riderEmail = riderEmail.email;
    }
    return res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    console.error("Error getting driver rides:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get driver rides",
      error: error.message,
    });
  }
};

export const rateRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (ride.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed rides can be rated",
      });
    }

    ride.rating = rating;
    ride.feedback = feedback || "";

    await ride.save();

    // Update driver's average rating
    if (ride.driverId) {
      const driverRides = await Ride.find({
        driverId: ride.driverId,
        rating: { $exists: true, $ne: null },
      });

      const totalRating = driverRides.reduce(
        (sum, ride) => sum + ride.rating,
        0
      );
      const averageRating = totalRating / driverRides.length;

      await Driver.findByIdAndUpdate(ride.driverId, {
        rating: parseFloat(averageRating.toFixed(1)),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ride rated successfully",
      ride,
    });
  } catch (error) {
    console.error("Error rating ride:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to rate ride",
      error: error.message,
    });
  }
};
