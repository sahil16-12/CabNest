import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rider", // Reference to the Rider model
        required: true,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver", // Reference to the Driver model
        required: true,
    },
    pickupLocation: {
        type: String,
        required: true,
    },
    dropoffLocation: {
        type: String,
        required: true,
    },
    pickupCoordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    dropoffCoordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    fare: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "wallet"],
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "ongoing", "completed", "canceled"],
        default: "pending",
    },
    rideStartTime: {
        type: Date,
    },
    rideEndTime: {
        type: Date,
    },
    distance: {
        type: Number, // In kilometers
    },
    duration: {
        type: Number, // In minutes
    },
    ratingByRider: {
        type: Number,
        min: 1,
        max: 5,
    },
    ratingByDriver: {
        type: Number,
        min: 1,
        max: 5,
    },
}, {
    timestamps: true, // Auto-generates createdAt and updatedAt
});

export const Ride = mongoose.model("Ride", rideSchema);
