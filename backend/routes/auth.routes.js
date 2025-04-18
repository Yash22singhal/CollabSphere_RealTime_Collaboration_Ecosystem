import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or Email already taken." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET || "alpha-beta",
      { expiresIn: "1h" }
    );

    res
      .status(201)
      .json({
        message: "User Registered Successfully.",
        userId: savedUser._id,
        token,
      });
  } catch (error) {
    console.error("SignUp error", error);
    response.status(500).json({ message: "Error Registering User." });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // Identifier can be username or email

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both identifier and password." });
    }

    // Find user by username or email
    const user = await User.findOne({email});

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ message: "Login successful", userId: user._id, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in." });
  }
});

router.get('/users/search', auth, async (req, res) => {
  try {
    const { query } = req.query; // Get the search query from the URL

    if (!query) {
      return res.status(400).json({ message: 'Search query is required.' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } }, // Case-insensitive search
        { email: { $regex: query, $options: 'i' } },
      ],
    }).select('_id username email'); // Only return _id, username, and email

    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Error searching users.' });
  }
});

export default router;