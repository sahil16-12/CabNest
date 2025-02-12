import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
        unique: true,
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
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle", // Reference to the Vehicle model
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address", // Reference to the Address model
        required: true,
    },
}, {
    timestamps: true,
});

export const Driver = mongoose.model("Driver", driverSchema);
