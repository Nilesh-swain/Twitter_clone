// Fixed port conflict
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import authRouter from "./router/auth.router.js";
import userRouter from "./router/user.router.js";
import postRouter from "./router/post.router.js";
import notificationRouter from "./router/notification.router.js";
import uploadRouter from "./router/upload.router.js";

import connectMangoDB from "./DB/connectmangodb.js";

// This bellows 2 lines will used for to access .env file
import dotenv from "dotenv";
dotenv.config();

// it is used to the upload images to the cloudinary.
if (process.env.CLOUDINARY_URL) {
  // Cloudinary will automatically parse CLOUDINARY_URL
  cloudinary.config({ secure: true });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const app = express();
const port = process.env.PORT || 9000;

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' })); // Middleware to parse JSON bodies.
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Middleware to parse URL-encoded bodies.

app.use(cookieParser());

app.use("/api/auth", authRouter); // Mount the auth router.
app.use("/api/user", userRouter); // Mount the user router.
app.use("/api/post", postRouter); // Mount the post router.
app.use("/api/upload", uploadRouter); // Mount the upload router.

app.use("/api/notification", notificationRouter);

// Catch-all for unknown routes, always return JSON
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Global error handler to always return JSON
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", details: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectMangoDB();
});
