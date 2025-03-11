/* eslint-disable @typescript-eslint/no-unused-vars */
//src/routes/user.ts

import express, { Request, Response } from "express";
import User from "../models/User";
import { auth } from "../middleware/auth";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Register a new user
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: "Username already exists" });
    }

    const user = new User({ username, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res
      .status(201)
      .json({ user: { id: user._id, username: user.username }, token });
  } catch (error) {
    res.status(400).json({ error: "Error creating user" });
  }
});

// Login user
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ error: "Invalid login credentials" });
    }

    const isMatch = await user?.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid login credentials" });
    }

    const token = jwt.sign({ id: user?._id }, JWT_SECRET);
    res.json({ user: { id: user?._id, username: user?.username }, token });
  } catch (error) {
    res.status(400).json({ error: "Error logging in" });
  }
});

// Get user profile
router.get(
  "/profile",
  auth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select("-password");
      if (!user) {
        res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Error fetching profile" });
    }
  }
);

export default router;
