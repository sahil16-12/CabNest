import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["online", "busy", "offline"],
      default: "offline",
    },
    profileImage: {
      type: String,
      default: "",
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    vehicleMake: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    vehicleYear: {
      type: Number,
      required: true,
    },
    vehicleColor: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ["bike", "auto", "car", "scooter"],
    },
    regNumber: {
      type: String,
      required: true,
      unique: true,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    lastLocationUpdate: {
      type: Date,
      default: null,
    },
    earnings: {
      transactions: [
        {
          amount: { type: Number, default: 0, min: 0 }, // Ensure amount is non-negative
          timestamp: { type: Date, default: Date.now },
        },
      ],
      default: [], // Default to empty array
    },
    ratings: [
      {
        value: { type: Number, default: 0, min: 1, max: 5 }, // Ensure rating is between 1 and 5
        timestamp: { type: Date, default: Date.now },
      },
    ],
    overallRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalDistance: {
      type: Number,
      default: 0,
      min: 0, // Ensure distance is non-negative
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
driverSchema.index({ currentLocation: "2dsphere" });

// Index for frequently queried fields
driverSchema.index({ licenseNumber: 1 });
driverSchema.index({ regNumber: 1 });

export const Driver = mongoose.model("Driver", driverSchema);