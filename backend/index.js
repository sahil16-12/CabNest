import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './database/db.js';
import userRoutes from './routes/userRoutes.js';
import DriverRoutes from './routes/DriverRoutes.js';
import RiderRoutes from './routes/RiderRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './models/User.js';
// Configure environment variables
dotenv.config();

// Convert the module URL to a directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.get('/', (req, res) => {
  res.send('Server is up and running...');
});
app.use('/api', userRoutes);
app.use('/api/rider', RiderRoutes);
app.use('/api/driver', DriverRoutes);
app.use('/api/admin',AdminRoutes)
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
// const createAdminUser = async () => {
//   try {
//       const newAdmin = new User({
//           name: "Admin User",
//           email: "admin@example.com", // Replace with actual admin email
//           password: "hashed_password", // Make sure to hash the password before saving
//           role: "admin", // Set role to "admin"
//       });

//       await newAdmin.save();
//       console.log("Admin user created successfully.");
//   } catch (error) {
//       console.error("Error creating admin user:", error);
//   }
// }
// createAdminUser();
// Start the server
const port = process.env.PORT || 5000;
connectDb()
  .then(() => {
    
    app.listen(port, () => {
      console.log('Server is running on http://localhost:' + port);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });