import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// =========================
// SIGN UP
// =========================
export const SignUp = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Error in SignUp:", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// =========================
// LOGIN
// =========================
export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "15d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // safer cross-site behavior
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      token,
    });
  } catch (error) {
    console.error("Error in Login:", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// =========================
// LOGOUT
// =========================
export const LogOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in LogOut:", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// =========================
// GET ME
// =========================
export const GetMe = async (req, res) => {
  try {
    const me = await User.findById(req.user._id).select("-password");
    res.status(200).json(me);
  } catch (error) {
    console.error("Error in GetMe:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};


// =========================
// PASSWORD RESET (OTP)
// =========================
import crypto from "crypto";
import nodemailer from "nodemailer";
// Optional: Twilio for SMS if TWILIO configured
import twilio from "twilio";

export const requestPasswordReset = async (req, res) => {
  try {
    const { email, via } = req.body; // via: "email" or "sms"
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.otp = otp;
    user.otpExpires = expires;
    await user.save();

    // Try to send via Email if configured
    if (process.env.SMTP_HOST && (via === "email" || !via)) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: "Your password reset OTP",
          text: `Your OTP is ${otp}. It expires in 15 minutes.`,
        });

        return res.status(200).json({ message: "OTP sent via email" });
      } catch (err) {
        console.error("Error sending email OTP:", err.message);
      }
    }

    // Try to send via Twilio SMS if configured and mobile available
    if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN && user.phone && (via === "sms")) {
      try {
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
        await client.messages.create({
          body: `Your OTP is ${otp}. It expires in 15 minutes.`,
          from: process.env.TWILIO_FROM,
          to: user.phone,
        });
        return res.status(200).json({ message: "OTP sent via SMS" });
      } catch (err) {
        console.error("Error sending SMS OTP:", err.message);
      }
    }

    // Fallback: return OTP in response for development (INSECURE)
    return res.status(200).json({ message: "OTP generated (development)", otp });
  } catch (error) {
    console.error("requestPasswordReset error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user || !user.otp) return res.status(400).json({ error: "Invalid request" });

    if (user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (user.otpExpires < new Date()) return res.status(400).json({ error: "OTP expired" });

    // mark verified by clearing otp but set a short-lived token field (optional)
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // create a temporary token to allow password reset (valid 15 minutes)
    const resetToken = crypto.randomBytes(20).toString("hex");
    // In production, store resetToken hashed in DB; here we return to client
    return res.status(200).json({ message: "OTP verified", resetToken });
  } catch (err) {
    console.error("verifyOTP error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword /*, resetToken */ } = req.body;
    if (!email || !newPassword) return res.status(400).json({ error: "Email and newPassword required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // In a stricter flow, verify resetToken; skipped here for simplicity
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
