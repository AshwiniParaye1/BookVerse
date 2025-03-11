/* eslint-disable @typescript-eslint/no-unused-vars */
//src/routes/user.ts

import express, { type Request, type Response } from "express";
import User from "../models/User";
import { auth } from "../middleware/auth";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Register a new user
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: "Username already exists" });
      return; // Add return statement to stop execution
    }

    const user = new User({ username, password, role });
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
      return; // Add return statement to stop execution
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid login credentials" });
      return; // Add return statement to stop execution
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ user: { id: user._id, username: user.username }, token });
  } catch (error) {
    res.status(400).json({ error: "Error logging in" });
  }
});

// Get user profile
router.get(
  "/profile",
  auth,
  async (
    req: Request & { user?: { id: string } },
    res: Response
  ): Promise<void> => {
    try {
      // Use req.user.id instead of req.params.id since this is coming from auth middleware
      const user = await User.findById(req.user?.id).select("-password");
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return; // Add return statement to stop execution
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Error fetching profile" });
    }
  }
);

export default router;
