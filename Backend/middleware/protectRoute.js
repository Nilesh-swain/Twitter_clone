import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token; // <-- match the name you used in Login
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    } catch (err) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired token" });
    }

    if (!decoded || !decoded.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid token payload" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    req.user = user; // attach user for later controllers
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;
