const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  earnings: {
    type: Number,
    required: true
  },
  pickup: {
    type: String,
    required: true
  },
  drop: {
    type: String,
    required: true
  },
  riderName: {
    type: String,
    required: true
  },
  riderRating: {
    type: Number,
    required: true
  },
  driverRating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  timestamp: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);