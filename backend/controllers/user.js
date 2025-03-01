import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import TryCatch from "../middlewares/TryCatch.js";
import sendMail from "../middlewares/sendMail.js";

export const register = TryCatch(async (req, res) => {
  const { email, name, password, role } = req.body;
  let user = await User.findOne({ email });

  if (user)
    return res.status(400).json({
      message: "User Already exists",
    });

  const hashPassword = await bcrypt.hash(password, 10);
  user = {
    name,
    email,
    role,
    password: hashPassword,
  };

  const otp = Math.floor(Math.random() * 1000000);

  const activationToken = jwt.sign(
    {
      user,
      otp,
    },
    process.env.Activation_Secret,
    {
      expiresIn: "5m",
    }
  );
  const data = {
    name,
    otp,
  };
  await sendMail(email, "Cab Booking", data);

  res.status(200).json({
    message: "Otp send to your mail",
    activationToken,
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;
  const verify = jwt.verify(activationToken, process.env.Activation_Secret);

  if (!verify)
    return res.status(400).json({
      message: "otp Expired",
    });
  if (verify.otp !== otp)
    return res.status(400).json({
      message: "Wrong Otp",
    });

  const user = await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
    role: verify.user.role,
  });
  console.log(user._id.toString());

  res.json({
    message: "User Register",
    userId: user._id.toString(),
    user: user,
    role: user.role,
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password, currentLocation } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide both email and password",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "No user found with this email",
    });
  }

  if (!user.password) {
    return res.status(400).json({
      message: "User password is missing in the database",
    });
  }

  if (user.role !== "admin") {
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }
  }

  const token = generateToken(user._id);

  if (user.role === "driver") {
    // Update driver location and status
    await Driver.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          status: "online",
          currentLocation: {
            type: "Point",
            coordinates: currentLocation || [0, 0],
          },
          lastLocationUpdate: new Date(),
        },
      },
      { new: true }
    );
  }

  res.status(200).json({
    message: `Welcome back, ${user.name}!`,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};
[];
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({ user });
});
