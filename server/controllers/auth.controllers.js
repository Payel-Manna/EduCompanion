import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
import User from "../models/user.models.js";

export const signUp = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;
    console.log(req.body);
    // Validate user input
    if (!name || !userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "User already exists!!" });
    }

    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ message: "User already exists!!" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      userName,
      email,
      password: hashedPassword,
    });

    const token = await genToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({ newUser,token });
  } catch (error) {
    res.status(500).json({ message: "Sign Up Error" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Validate user input
    if (!userName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "Invalid Username" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({user,token});
  } catch (error) {
    res.status(500).json({ message: "Sign In Error" });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "strict",
    });
    res.status(200).json({ message: "User Logged Out Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Sign Out Error" });
  }
};
