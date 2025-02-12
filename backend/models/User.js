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
        enum: ['driver', 'rider'],
        default: 'rider', // Default is 'rider'
    },

   
}, {
    timestamps: true, // To automatically create 'createdAt' and 'updatedAt' timestamps
});

// Create the User model
export const User = mongoose.model("User", schema);
