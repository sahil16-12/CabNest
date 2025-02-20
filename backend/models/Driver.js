import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
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
        type: String, // URL or file path of profile image
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
}, {
    timestamps: true,
});

export const Driver = mongoose.model("Driver", driverSchema);
