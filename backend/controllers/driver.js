import { Driver } from "../models/Driver.js";

/**
 * @desc    Create a new driver with profile image upload
 * @route   POST /api/drivers
 * @access  Public
 */
export const createDriver = async (req, res) => {
    try {
        const { user, fullName, phoneNumber, dateOfBirth, vehicle, licenseNumber, address } = req.body;
        const profileImage = req.file ? `/uploads/${req.file.filename}` : ""; // Image path

        // Check if driver already exists
        const existingDriver = await Driver.findOne({ user });
        if (existingDriver) {
            return res.status(400).json({ message: "Driver already registered" });
        }

        const driver = new Driver({ user, fullName, phoneNumber, dateOfBirth, profileImage, vehicle, licenseNumber, address });
        await driver.save();

        res.status(201).json({ message: "Driver created successfully", driver });
    } catch (error) {
        res.status(500).json({ message: "Error creating driver", error: error.message });
    }
};

/**
 * @desc    Get all drivers
 * @route   GET /api/drivers
 * @access  Public
 */
export const getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find().populate("user vehicle");
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching drivers", error: error.message });
    }
};

/**
 * @desc    Get driver by ID
 * @route   GET /api/drivers/:id
 * @access  Public
 */
export const getDriverById = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id).populate("user vehicle");
        if (!driver) return res.status(404).json({ message: "Driver not found" });

        res.status(200).json(driver);
    } catch (error) {
        res.status(500).json({ message: "Error fetching driver", error: error.message });
    }
};

/**
 * @desc    Update driver details
 * @route   PUT /api/drivers/:id
 * @access  Private
 */
export const updateDriver = async (req, res) => {
    try {
        const { fullName, phoneNumber, dateOfBirth, vehicle, licenseNumber, address } = req.body;
        const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

        const updatedDriver = await Driver.findByIdAndUpdate(
            req.params.id,
            { fullName, phoneNumber, dateOfBirth, profileImage, vehicle, licenseNumber, address },
            { new: true }
        );

        if (!updatedDriver) return res.status(404).json({ message: "Driver not found" });

        res.status(200).json({ message: "Driver updated successfully", updatedDriver });
    } catch (error) {
        res.status(500).json({ message: "Error updating driver", error: error.message });
    }
};

/**
 * @desc    Delete driver
 * @route   DELETE /api/drivers/:id
 * @access  Private
 */
export const deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndDelete(req.params.id);
        if (!driver) return res.status(404).json({ message: "Driver not found" });

        res.status(200).json({ message: "Driver deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting driver", error: error.message });
    }
};
