import TryCatch from "../middlewares/TryCatch.js";
import { Rider } from "../models/Rider.js";
import fs from "fs";
import { promisify } from "util";

const unlinkAsync = promisify(fs.unlink);

/**
 * @desc    Create a new rider with profile image upload
 * @route   POST /api/riders
 * @access  Public
 */
export const createRider = TryCatch(async (req, res) => {
    const { _id, dateOfBirth, phoneNumber, address } = req.body;
    const profileImage = req.file?.path;

    // Check if rider already exists
    const existingRider = await Rider.findOne({ _id});
    if (existingRider) {
        return res.status(400).json({ message: "Rider already registered" });
    }

    const rider = await Rider.create({ _id, dateOfBirth, phoneNumber, address, profileImage });

    res.status(201).json({ message: "Rider created successfully", rider });
});

/**
 * @desc    Get rider by ID
 * @route   GET /api/riders/:id
 * @access  Public
 */
export const getRiderById = TryCatch(async (req, res) => {
    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).json({ message: "Rider not found" });

    res.status(200).json(rider);
});

/**
 * @desc    Update rider details
 * @route   PUT /api/riders/:id
 * @access  Private
 */
export const updateRider = TryCatch(async (req, res) => {
    const { dateOfBirth, phoneNumber, address } = req.body;
    const newProfileImage = req.file?.path;

    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).json({ message: "Rider not found" });

    if (newProfileImage && rider.profileImage) {
        await unlinkAsync(rider.profileImage).catch(() => {});
    }

    rider.dateOfBirth = dateOfBirth;
    rider.phoneNumber = phoneNumber;
    rider.address = address;
    if (newProfileImage) rider.profileImage = newProfileImage;

    await rider.save();

    res.status(200).json({ message: "Rider updated successfully", rider });
});

/**
 * @desc    Delete rider
 * @route   DELETE /api/riders/:id
 * @access  Private
 */
export const deleteRider = TryCatch(async (req, res) => {
    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).json({ message: "Rider not found" });

    if (rider.profileImage) {
        await unlinkAsync(rider.profileImage).catch(() => {});
    }

    await rider.deleteOne();
    res.status(200).json({ message: "Rider deleted successfully" });
});
