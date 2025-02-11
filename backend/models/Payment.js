import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride", // Reference to the Ride model
        required: true,
    },
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rider", // Reference to Rider who made the payment
        required: true,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver", // Reference to Driver who received the payment
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "wallet"],
        required: true,
    },
    transactionId: {
        type: String,
        unique: true,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
}, {
    timestamps: true, // Auto-generates createdAt and updatedAt
});

export const Payment = mongoose.model("Payment", paymentSchema);
