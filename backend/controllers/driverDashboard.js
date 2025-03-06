
import { Driver } from "../models/Driver.js";

// Get earnings data
export const getEarnings = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .select("earnings")
      .lean();

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Calculate yearly earnings (assuming monthly * 12 for demonstration)
    const yearlyEarnings = driver.earnings.monthly * 12;

    res.status(200).json({
      success: true,
      data: {
        daily: driver.earnings.daily,
        weekly: driver.earnings.weekly,
        monthly: driver.earnings.monthly,
        yearly: yearlyEarnings,
      },
    });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get overall rating
export const getRating = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({
      success: true,
      rating: driver.overallRating,
    });
  } catch (error) {
    console.error("Error fetching rating:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// Get driver status
export const getStatus = async (req, res) => {
    try {
      // Find the driver by ID and select only the status field
      const driver = await Driver.findById(req.params.id).select("status");
  
      // If driver not found, return 404
      if (!driver) {
        return res.status(404).json({ 
          success: false, 
          message: "Driver not found" 
        });
      }
  
      // Return the driver's status
      res.status(200).json({
        success: true,
        status: driver.status,
      });
    } catch (error) {
      console.error("Error fetching driver status:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error" 
      });
    }
  };
// Update driver status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["online", "busy", "offline"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const driver = await Driver.findByIdAndUpdate(
        req.params.id,
      { status },
      { new: true }
    ).select("status");

    res.status(200).json({
      success: true,
      status: driver.status,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get total distance
export const getTotalDistance = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .select("totalDistance")
      .lean();

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({
      success: true,
      totalDistance: driver.totalDistance,
    });
  } catch (error) {
    console.error("Error fetching total distance:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};