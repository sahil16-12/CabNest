import mongoose from "mongoose";

const riderSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    profileImage: {
        type: String, // URL or file path of profile image
        default: "", 
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type:String,
        required: true,
    },
}, {
    timestamps: true, // Auto-adds createdAt and updatedAt fields
});

export const Rider = mongoose.model("Rider", riderSchema);
