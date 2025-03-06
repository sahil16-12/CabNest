import { instance } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { PaymentUpi } from "../models/PaymentUpi.js";
import { Rider } from "../models/Rider.js";
import crypto from 'crypto';

export const checkout = TryCatch(async (req, res) => {
    const user = await Rider.findById(req.params._id);

    const option = {
        amount: Number(200), // Consider dynamic amount from request
        currency: "INR"
    };
    const order = await instance.orders.create(option);

    res.status(201).json({
        order
    });
});

export const paymentVerification = TryCatch(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.KEY_SECRET) // Updated environment variable
        .update(body)
        .digest("hex");
  
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        await PaymentUpi.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        });

        res.status(200).json({
            message: "Ride Payment Successful"
        });
    } else {
        res.status(400).json({
            message: "Payment Failed"
        });
    }
});