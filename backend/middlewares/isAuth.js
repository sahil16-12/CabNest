import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(403).json({ message: 'Please login' });
    }
    const decodeData = jwt.verify(token, process.env.Jwt_Secret);
    req.user = await User.findById(decodeData._id);
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    next();
  } catch (e) {
    return res.status(500).json({ message: 'Login required' });
  }
};
export const isAdmin = (req, res, next) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You are not an admin' });
      }
      next();
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };
  