import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './database/db.js';
import userRoutes from './routes/userRoutes.js';
import DriverRoutes from './routes/DriverRoutes.js';
import RiderRoutes from './routes/RiderRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;
connectDb().then(() => {
    app.listen(port, () => {
        console.log('Server is running on http://localhost:' + port);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});

app.get('/', (req, res) => {
    res.send("Server is up and running...");
});
app.use("/api", userRoutes);
app.use("/api/rider",RiderRoutes);
app.use("/api/driver",DriverRoutes);



