import { instance } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { PaymentUpi } from "../models/PaymentUpi.js";
import crypto from "crypto";

export const checkout = TryCatch(async (req, res) => {
  const { amount } = req.body; // Get the amount from the request body
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Invalid amount" });
  }
  const options = {
    amount: Number(amount), // Convert to paise (Razorpay expects amount in the smallest currency unit)
    currency: "INR",
  };

  try {
    const order = await instance.orders.create(options);
    res.status(201).json({ order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

export const paymentVerification = TryCatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

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
      razorpay_signature,
    });

    res.status(200).json({
      message: "Ride Payment Successful",
    });
  } else {
    res.status(400).json({
      message: "Payment Failed",
    });
  }
});
