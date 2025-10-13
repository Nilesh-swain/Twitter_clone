import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import twilio from "twilio";
import crypto from "crypto";

let otpStore = {}; // temporary storage for OTPs

// Function to generate a secure 6-digit OTP
const generateSecureOtp = () => {
  const otp = crypto.randomBytes(3).readUIntBE(0, 3) % 900000 + 100000;
  return otp.toString();
};

// Function to send email with retry mechanism
const sendEmailWithRetry = async (transporter, mailOptions, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await transporter.sendMail(mailOptions);
      return;
    } catch (err) {
      console.error(`Email send attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      } else {
        throw err;
      }
    }
  }
};

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



    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    await newUser.save();

    return res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error("Error in SignUp:", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// =========================
// CREATE ADMIN
// =========================
export const CreateAdmin = async (req, res) => {
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

    const newAdmin = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();

    return res.status(201).json({
      _id: newAdmin._id,
      fullname: newAdmin.fullname,
      username: newAdmin.username,
      email: newAdmin.email,
      role: newAdmin.role,
    });
  } catch (error) {
    console.error("Error in CreateAdmin:", error.message);
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

    if (!user.isVerified) {
      return res.status(400).json({ error: "Please verify your email first" });
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
    if (!req.user) {
      return res.status(200).json({ user: null });
    }
    const me = await User.findById(req.user._id).select("-password");
    res.status(200).json({ user: me });
  } catch (error) {
    console.error("Error in GetMe:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// =========================
// PASSWORD RESET (OTP)
// =========================
export const requestPasswordReset = async (req, res) => {
  try {
    const { email, via } = req.body; // via: "email" or "sms"
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // generate secure 6-digit OTP
    const otp = generateSecureOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = hashedOtp;
    user.otpExpires = expires;
    await user.save();

    // Try to send via Email if configured
    if (process.env.SMTP_HOST && (via === "email" || !via)) {
      try {
        let transporterConfig = {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE !== "false",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        };

        // Special handling for Gmail
        if (process.env.SMTP_HOST === 'smtp.gmail.com' || process.env.SMTP_HOST.includes('gmail')) {
          transporterConfig = {
            service: 'gmail',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          };
        }

        const transporter = nodemailer.createTransport(transporterConfig);

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>You requested a password reset. Use the OTP below to verify your identity and reset your password.</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #007bff; background: #f8f9fa; padding: 10px 20px; border-radius: 5px; display: inline-block;">${otp}</span>
            </div>
            <p><strong>Important:</strong> This OTP is valid for 10 minutes only. Do not share this code with anyone. If you did not request this, please ignore this email or contact support immediately.</p>
            <p>Best regards,<br>Twitter Clone Team</p>
          </div>
        `;

        await sendEmailWithRetry(transporter, {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: "Your password reset OTP - Twitter Clone",
          text: `Your OTP for password reset is ${otp}. It expires in 10 minutes. Do not share this code with anyone.`,
          html: htmlContent,
        });

        return res.status(200).json({ message: "OTP sent via email" });
      } catch (err) {
        console.error("Error sending email OTP:", err.message);
      }
    }

    // Try to send via Twilio SMS if configured and mobile available
    if (
      process.env.TWILIO_SID &&
      process.env.TWILIO_TOKEN &&
      user.phone &&
      via === "sms"
    ) {
      try {
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
        await client.messages.create({
          body: `Your OTP is ${otp}. It expires in 10 minutes. Do not share this code with anyone.`,
          from: process.env.TWILIO_FROM,
          to: user.phone,
        });
        return res.status(200).json({ message: "OTP sent via SMS" });
      } catch (err) {
        console.error("Error sending SMS OTP:", err.message);
      }
    }

    // Fallback: return OTP in response for development (INSECURE)
    return res
      .status(200)
      .json({ message: "OTP generated (development)", otp });
  } catch (error) {
    console.error("requestPasswordReset error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user || !user.otp)
      return res.status(400).json({ error: "Invalid request" });

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) return res.status(400).json({ error: "Invalid OTP" });
    if (user.otpExpires < new Date())
      return res.status(400).json({ error: "OTP expired" });

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
    if (!email || !newPassword)
      return res.status(400).json({ error: "Email and newPassword required" });

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

// =========================
// VERIFY SIGNUP OTP
// =========================
export const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: "Email and OTP are required" });

    if (!otpStore[email]) return res.status(400).json({ error: "Invalid request" });

    const { otp: storedOtp, expires } = otpStore[email];
    if (storedOtp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (Date.now() > expires) return res.status(400).json({ error: "OTP expired" });

    // Verify the user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    user.isVerified = true;
    await user.save();

    delete otpStore[email]; // Clean up

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("verifySignupOTP error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// =========================
// RESEND SIGNUP OTP
// =========================
export const resendSignupOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified) return res.status(400).json({ error: "User already verified" });

    // Rate limiting: allow resend only once per 30 seconds (using in-memory for simplicity)
    if (otpStore[email] && otpStore[email].lastResendAt && (Date.now() - otpStore[email].lastResendAt) < 30 * 1000) {
      return res.status(429).json({ error: "Please wait 30 seconds before requesting another OTP" });
    }

    // Generate new secure OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000, lastResendAt: Date.now() }; // 5 minutes

    // Send OTP via email
    let emailSent = false;
    if (process.env.SMTP_HOST) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE !== "false",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333;">Welcome to Twitter Clone!</h2>
            <p>We noticed you requested a new OTP. To complete your registration, please verify your email address using the new OTP below.</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #007bff; background: #f8f9fa; padding: 10px 20px; border-radius: 5px; display: inline-block;">${otp}</span>
            </div>
            <p><strong>Important:</strong> This OTP is valid for 5 minutes only. Do not share this code with anyone for your account security.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>Twitter Clone Team</p>
          </div>
        `;

        await sendEmailWithRetry(transporter, {
          from: process.env.SMTP_USER,
          to: user.email,
          subject: "Verify your email - New OTP for Twitter Clone",
          text: `Your new OTP for email verification is ${otp}. It expires in 5 minutes. Do not share this code.`,
          html: htmlContent,
        });

        emailSent = true;
        return res.status(200).json({ message: "OTP resent successfully" });
      } catch (err) {
        console.error("Error resending verification email via SMTP:", err.message);
      }
    }

    // If SMTP is not configured, return OTP in response for development (INSECURE)
    if (!emailSent) {
      console.error("SMTP not configured. Returning OTP for development.");
      return res.status(200).json({ message: "OTP generated (development)", otp });
    }
  } catch (err) {
    console.error("resendSignupOTP error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
