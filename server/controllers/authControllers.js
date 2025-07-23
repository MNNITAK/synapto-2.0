import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    google: false,
    passkey: null,
    challenge: null,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      isAdmin:user.isAdmin
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      isAdmin:user.isAdmin
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// Request OTP route
export const requestOtpReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  const expiry = Date.now() + 10 * 60 * 1000;

  user.resetPasswordOTP = otp;
  user.resetPasswordExpires = expiry;
  await user.save();

  await sendEmail(
    user.email,
    "Synapto Password Reset OTP",
    `<p>Your OTP is <b>${otp}</b>. It will expire in 10 minutes.</p>`
  );

  res.status(200).json({ message: "OTP sent to email." });
};

// Verify OTP Route
export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const email = req.body.email?.trim().toLowerCase();
  const user = await User.findOne({ email });

  if (
    !user ||
    user.resetPasswordOTP !== otp ||
    user.resetPasswordExpires < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  res.status(200).json({ message: "OTP verified." });
};

// Reset Password Route
export const resetPassword = async (req, res) => {
  const { otp, newPassword } = req.body;
  const email = req.body.email?.trim().toLowerCase();
  const user = await User.findOne({ email });

  if (
    !user ||
    user.resetPasswordOTP !== otp ||
    user.resetPasswordExpires < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  user.password = newPassword; // bcrypt will hash in pre-save
  user.resetPasswordOTP = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password reset successful." });
};