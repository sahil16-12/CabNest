import mongoose from "mongoose";

// Define a new schema for the Cab Booking System
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'driver', 'rider'],
        default: 'rider', // Default is 'rider'
    },

    // Driver-specific fields
    // vehicleDetails: {
    //     type: Object,
    //     // Information for the driver's vehicle, like model, number, etc.
    //     vehicleType: String,
    //     vehicleNumber: String,
    //     licenseNumber: String,
    // },
    // // Ride history for both riders and drivers
    // rideHistory: [
    //     {
    //         rideId: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: "Ride", // Reference to a 'Ride' model
    //         },
    //         status: {
    //             type: String,
    //             enum: ['completed', 'cancelled', 'in-progress'],
    //             default: 'in-progress',
    //         },
    //         date: {
    //             type: Date,
    //             default: Date.now,
    //         },
    //     },
    // ],
    // // Password reset feature
    // resetPasswordExpire: Date,
}, {
    timestamps: true, // To automatically create 'createdAt' and 'updatedAt' timestamps
});

// Create the User model
export const User = mongoose.model("User", schema);
