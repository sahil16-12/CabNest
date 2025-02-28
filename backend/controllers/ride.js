import { Ride } from "../models/Ride.js";

const getRideDetails = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.json({
      fare: `₱${ride.fare.toFixed(2)}`,
      distance: `${ride.distance.toFixed(1)} km`,
      duration: `${ride.duration} mins`,
      earnings: `₱${ride.earnings.toFixed(2)}`,
      riderName: ride.riderName,
      riderRating: ride.riderRating,
      pickup: ride.pickup,
      drop: ride.drop,
      timestamp: ride.timestamp.toLocaleString('en-PH', {
        hour: 'numeric',
        minute: '2-digit',
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const submitRating = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    const { rating, feedback } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1-5' });
    }

    ride.driverRating = rating;
    ride.feedback = feedback;
    await ride.save();

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getRideDetails, submitRating };