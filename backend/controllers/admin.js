import { User } from '../models/User.js';
import { Driver } from '../models/Driver.js';
import { Rider } from '../models/Rider.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const [totalDrivers, totalRiders] = await Promise.all([
      User.countDocuments({ role: 'driver' }),
      User.countDocuments({ role: 'rider' })
    ]);

    res.status(200).json({
      success: true,
      totalDrivers,
      totalRiders,
      totalUsers: totalDrivers + totalRiders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users with details
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v -createdAt -updatedAt');
    
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        let details = {};
        if (user.role === 'driver') {
          details = await Driver.findById(user._id).select('-__v -createdAt -updatedAt').lean();
        } else if (user.role === 'rider') {
          details = await Rider.findById(user._id).select('-__v -createdAt -updatedAt').lean();
        }
        return { ...user.toObject(), ...(details || {}) };
      })
    );

    res.status(200).json({ success: true, users: usersWithDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user by ID with full details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v -createdAt -updatedAt');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let details = {};
    if (user.role === 'driver') {
      details = await Driver.findById(user._id).select('-__v -createdAt -updatedAt').lean();
    } else if (user.role === 'rider') {
      details = await Rider.findById(user._id).select('-__v -createdAt -updatedAt').lean();
    }

    res.status(200).json({ success: true, user: { ...user.toObject(), ...details } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user and associated data
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Delete role-specific document
    if (user.role === 'driver') {
      await Driver.findByIdAndDelete(user._id);
    } else if (user.role === 'rider') {
      await Rider.findByIdAndDelete(user._id);
    }

    await User.findByIdAndDelete(user._id);

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};