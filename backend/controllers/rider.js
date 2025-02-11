import { Rider } from "../models/Rider.js";

/**
 * @desc    Create a new rider with profile image upload
 * @route   POST /api/riders
 * @access  Public
 */
export const createRider = async (req, res) => {
    try {
        const { user, dateOfBirth, phoneNumber, address } = req.body;
        const profileImage = req.file ? `/uploads/${req.file.filename}` : ""; // Image path

        // Check if rider already exists
        const existingRider = await Rider.findOne({ user });
        if (existingRider) {
            return res.status(400).json({ message: "Rider already registered" });
        }

        const rider = new Rider({ user, dateOfBirth, phoneNumber, address, profileImage });
        await rider.save();

        res.status(201).json({ message: "Rider created successfully", rider });
    } catch (error) {
        res.status(500).json({ message: "Error creating rider", error: error.message });
    }
};

/**
 * @desc    Get rider by ID
 * @route   GET /api/riders/:id
 * @access  Public
 */
export const getRiderById = async (req, res) => {
    try {
        const rider = await Rider.findById(req.params.id).populate("user");
        if (!rider) return res.status(404).json({ message: "Rider not found" });

        res.status(200).json(rider);
    } catch (error) {
        res.status(500).json({ message: "Error fetching rider", error: error.message });
    }
};

/**
 * @desc    Update rider details
 * @route   PUT /api/riders/:id
 * @access  Private
 */
export const updateRider = async (req, res) => {
    try {
        const { dateOfBirth, phoneNumber, address } = req.body;
        const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

        const updatedRider = await Rider.findByIdAndUpdate(
            req.params.id,
            { dateOfBirth, phoneNumber, address, profileImage },
            { new: true }
        );

        if (!updatedRider) return res.status(404).json({ message: "Rider not found" });

        res.status(200).json({ message: "Rider updated successfully", updatedRider });
    } catch (error) {
        res.status(500).json({ message: "Error updating rider", error: error.message });
    }
};

/**
 * @desc    Delete rider
 * @route   DELETE /api/riders/:id
 * @access  Private
 */
export const deleteRider = async (req, res) => {
    try {
        const rider = await Rider.findByIdAndDelete(req.params.id);
        if (!rider) return res.status(404).json({ message: "Rider not found" });

        res.status(200).json({ message: "Rider deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting rider", error: error.message });
    }
};
