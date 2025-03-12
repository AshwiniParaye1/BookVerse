//server/ts

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

app.get("/", (req, res) => {
  res.json({ message: "Welcome to BookVerse!" });
});

const startServer = () => {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Listening on: ${port}`);
  });
};

startServer();
