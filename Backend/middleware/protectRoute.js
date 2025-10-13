import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token; // <-- match the name you used in Login
    if (!token) {
      req.user = null;
      return next();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    } catch (err) {
      req.user = null;
      return next();
    }

    if (!decoded || !decoded.id) {
      req.user = null;
      return next();
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      req.user = null;
      return next();
    }

    req.user = user; // attach user for later controllers
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    req.user = null;
    return next();
  }
};

export default protectRoute;
