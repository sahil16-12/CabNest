import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  deleteUser
} from '../controllers/admin.js';
import { uploadFiles } from '../middlewares/multer.js';

const router = express.Router();

const isAdmin = (req, res, next) => {
  console.log(req.user)
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ error: 'Admin access required' });
};

// Usage
router.get('/dashboard',getDashboardStats);
router.get('/users',uploadFiles, getAllUsers);
router.get('/users/:id',uploadFiles, getUserById);

router.delete('/users/:id',uploadFiles,deleteUser);

export default router;