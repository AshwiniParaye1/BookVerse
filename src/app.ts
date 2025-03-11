/* eslint-disable @typescript-eslint/no-unused-vars */
//src/app.ts

import express from "express";
import connectDB from "./config/database";
import userRoutes from "./routes/user";
import bookRoutes from "./routes/book";
import borrowRoutes from "./routes/borrow";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrows", borrowRoutes);

app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to BookVerse!" });
});

export default app;
