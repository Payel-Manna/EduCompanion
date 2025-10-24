
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

const isAuth = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id name email");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user object so controllers can use req.user._id
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default isAuth;
