import { Driver } from "../models/Driver.js";

/**
 * @desc    Create a new driver with profile image upload
 * @route   POST /api/drivers
 * @access  Public
 */
export const createDriver = async (req, res) => {
  try {
    const {
      phoneNumber,
      dateOfBirth,
      licenseNumber,
      address,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehicleColor,
      vehicleType,
      regNumber,
      _id,
    } = req.body;

    const profileImage = req.file?.path; // Image path

    // Ensure unique licenseNumber and regNumber
    const duplicate = await Driver.findOne({
      $or: [{ licenseNumber }, { regNumber }],
    });
    if (duplicate) {
      return res.status(400).json({
        message: "License number or registration number already in use",
      });
    }

    // Create new driver
    const driver = new Driver({
      _id,
      phoneNumber,
      dateOfBirth,
      status: "offline",
      profileImage,
      licenseNumber,
      address,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehicleColor,
      vehicleType,
      regNumber,
      currentLocation: {
        type: "Point",
        coordinates: [0, 0],
      },
      lastLocationUpdate: new Date(),
      ratings: [],
      overallRating: 0,
      totalDistance: 0,
    });
    console.log("================================");
    await driver.save();
    console.log("=========================5454=======");
    res.status(201).json({ message: "Driver created successfully", driver });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating driver", error: error.message });
  }
};

/**
 * @desc    Get all drivers
 * @route   GET /api/drivers
 * @access  Public
 */
export const getAllDrivers = async (req, res) => {
  try {
    const { pickupLat, pickupLng, vehicleType } = req.query;

    if (!pickupLat || !pickupLng) {
      return res
        .status(400)
        .json({ message: "Pickup location coordinates are required" });
    }

    // Convert string coordinates to numbers
    const lat = parseFloat(pickupLat);
    const lng = parseFloat(pickupLng);

    // Find online drivers within 5km radius of pickup location
    const drivers = await Driver.find({
      status: "online",
      vehicleType: vehicleType,
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat], // GeoJSON uses [longitude, latitude] format
          },
          $maxDistance: 10000, // 5km in meters
        },
      },
    }).populate("_id");

    res.status(200).json({ drivers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching drivers", error: error.message });
  }
};

/**
 * @desc    Get driver by ID
 * @route   GET /api/drivers/:id
 * @access  Public
 */
export const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json(driver);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching driver", error: error.message });
  }
};

/**
 * @desc    Update driver details
 * @route   PUT /api/drivers/:id
 * @access  Private
 */
export const updateDriver = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      dateOfBirth,
      licenseNumber,
      address,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehicleColor,
      vehicleType,
      regNumber,
    } = req.body;

    const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        phoneNumber,
        dateOfBirth,
        profileImage,
        licenseNumber,
        address,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vehicleColor,
        vehicleType,
        regNumber,
      },
      { new: true } // Return the updated document
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res
      .status(200)
      .json({ message: "Driver updated successfully", updatedDriver });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating driver", error: error.message });
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
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting driver", error: error.message });
  }
};
