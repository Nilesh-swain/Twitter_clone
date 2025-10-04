import express from "express";
import crypto from "crypto";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Generate Cloudinary upload signature
router.get("/signature", protectRoute, (req, res) => {
  try {
    const timestamp = Math.round((new Date).getTime() / 1000);

    let apiKey, apiSecret, cloudName;

    if (process.env.CLOUDINARY_URL) {
      // Parse CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
      const url = new URL(process.env.CLOUDINARY_URL);
      apiKey = url.username;
      apiSecret = url.password;
      cloudName = url.hostname;
    } else {
      // Fallback to individual environment variables
      apiKey = process.env.CLOUDINARY_API_KEY;
      apiSecret = process.env.CLOUDINARY_API_SECRET;
      cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    }

    if (!apiKey || !apiSecret || !cloudName) {
      return res.status(500).json({ error: "Cloudinary configuration missing" });
    }

    // Parameters to include in signature (sorted alphabetically)
    const params = {
      timestamp: timestamp,
      folder: "twitter-clone"
    };

    // Create signature string: sort parameters alphabetically and join
    const signatureString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&') + apiSecret;

    // Generate SHA1 hash
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    res.json({
      timestamp,
      signature,
      apiKey,
      cloudName,
      folder: params.folder
    });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    res.status(500).json({ error: "Failed to generate upload signature" });
  }
});

export default router;
