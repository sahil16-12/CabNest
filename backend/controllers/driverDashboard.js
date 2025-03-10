import { Driver } from "../models/Driver.js";

// Utility function to calculate time-based earnings
const calculateTimeBasedEarnings = (transactions) => {
  const now = new Date();
  return {
    daily: transactions
      .filter((t) => t.timestamp > new Date(now - 24 * 60 * 60 * 1000))
      .reduce((sum, t) => sum + t.amount, 0),

    weekly: transactions
      .filter((t) => t.timestamp > new Date(now - 7 * 24 * 60 * 60 * 1000))
      .reduce((sum, t) => sum + t.amount, 0),

    monthly: transactions
      .filter((t) => t.timestamp > new Date(now - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, t) => sum + t.amount, 0),

    yearly: transactions
      .filter((t) => t.timestamp > new Date(now - 365 * 24 * 60 * 60 * 1000))
      .reduce((sum, t) => sum + t.amount, 0),
  };
};

// Get earnings data with dynamic time-based calculations
export const getEarnings = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .select("earnings.transactions")
      .lean();

    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    const earnings = calculateTimeBasedEarnings(driver.earnings.transactions);

    res.status(200).json({
      success: true,
      data: earnings,
    });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update earnings with transaction tracking
export const updateEarnings = async (req, res) => {
  try {
    const { payment } = req.body;
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          "earnings.transactions": {
            amount: payment,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    res.status(200).json({
      success: true,
      message: "Earnings updated successfully",
    });
  } catch (error) {
    console.error("Error updating earnings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getRating = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .select("ratings overallRating")
      .lean();

    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    // Calculate average rating if not already stored
    let averageRating = driver.overallRating;
    if (!averageRating && driver.ratings.length > 0) {
      const sumRatings = driver.ratings.reduce((sum, r) => sum + r.value, 0);
      averageRating = sumRatings / driver.ratings.length;
    }

    res.status(200).json({
      success: true,
      data: {
        averageRating: averageRating || 0, // Default to 0 if no ratings exist
        totalRatings: driver.ratings.length,
      },
    });
  } catch (error) {
    console.error("Error fetching rating:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update driver rating with average calculation
export const updateRating = async (req, res) => {
  try {
    const { rating } = req.body;

    // Add the new rating to the driver's ratings array
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          ratings: {
            value: rating,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    // Calculate the new average rating
    const totalRatings = driver.ratings.length;
    const sumRatings = driver.ratings.reduce((sum, r) => sum + r.value, 0);
    const overallRating = sumRatings / totalRatings;

    // Update the driver's overallRating field
    await Driver.findByIdAndUpdate(req.params.id, { overallRating });

    res.status(200).json({
      success: true,
      data: { overallRating },
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get driver status
export const getStatus = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).select("status").lean();

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { status: driver.status },
    });
  } catch (error) {
    console.error("Error fetching driver status:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update driver status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["online", "busy", "offline"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select("status");

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { status: driver.status },
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get total distance
export const getTotalDistance = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .select("totalDistance")
      .lean();

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { totalDistance: driver.totalDistance },
    });
  } catch (error) {
    console.error("Error fetching total distance:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update total distance with atomic operation
export const updateTotalDistance = async (req, res) => {
  try {
    const { distance } = req.body;

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { $inc: { totalDistance: distance } },
      { new: true, runValidators: true }
    ).select("totalDistance");

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { totalDistance: driver.totalDistance },
    });
  } catch (error) {
    console.error("Error updating total distance:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
