import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    status: {
      type: String,
      enum: ["requested", "accepted", "in-progress", "completed", "canceled"],
      default: "requested",
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    distance: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    pickup: {
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        type: {
          type: String,
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
    drop: {
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        type: {
          type: String,
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
    rideType: {
      type: String,
      enum: ["standard", "premium", "shared"],
      default: "standard",
    },
    actualPickupTime: {
      type: Date,
      default: null,
    },
    actualDropTime: {
      type: Date,
      default: null,
    },
    requestedTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for geospatial queries
rideSchema.index({ "pickup.coordinates": "2dsphere" });
rideSchema.index({ "drop.coordinates": "2dsphere" });

rideSchema.methods.calculateETA = function () {
  // Get the base duration in seconds from the ride data
  const durationInSeconds = this.duration;

  // Simple time of day adjustment
  const now = new Date();
  const hour = now.getHours();
  let multiplier = 1.0;

  // Basic rush hour detection (7-9 AM and 5-7 PM on weekdays)
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    // During rush hours, add 15% to the estimated time
    multiplier = 1.15;
  }

  // Apply the multiplier to the duration
  const adjustedDurationInSeconds = Math.round(durationInSeconds * multiplier);

  // Calculate the ETA datetime
  const etaDateTime = new Date(
    now.getTime() + adjustedDurationInSeconds * 1000
  );

  return {
    estimatedDurationInMinutes: Math.ceil(adjustedDurationInSeconds / 60),
    etaDateTime: etaDateTime,
  };
};

export const Ride = mongoose.model("Ride", rideSchema);
