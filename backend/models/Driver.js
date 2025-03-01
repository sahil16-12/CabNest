import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    fullName: {
      type: String,
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
      unique: true,
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
        enum: ["bike", "auto", "car", "scooter"], // Allowed vehicle types
    },
    regNumber: {
        type: String,
        required: true,
        unique: true, // Ensure registration numbers are unique
    },
    status: {
        type: String,
        enum: ["online", "busy", "offline"],
        default: "offline",
      },
  
}, {
    timestamps: true,
  }
);

export const Driver = mongoose.model("Driver", driverSchema);