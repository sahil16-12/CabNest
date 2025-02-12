import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride", // Reference to the Ride model
        required: true,
    },
    givenBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "userType", // Dynamically references Rider or Driver
        required: true,
    },
    userType: {
        type: String,
        enum: ["Rider", "Driver"], // Specifies if the feedback is from a Rider or Driver
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        maxlength: 500,
    },
}, {
    timestamps: true, // Auto-generates createdAt and updatedAt
});

export const Feedback = mongoose.model("Feedback", feedbackSchema);
