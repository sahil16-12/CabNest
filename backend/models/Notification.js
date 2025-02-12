import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "recipientType", // Dynamically references Rider or Driver
        required: true,
    },
    recipientType: {
        type: String,
        enum: ["Rider", "Driver"],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["ride_request", "payment", "feedback", "general"],
        required: true,
    },
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride", // Optional reference to a related ride
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // Auto-generates createdAt and updatedAt
});

export const Notification = mongoose.model("Notification", notificationSchema);
