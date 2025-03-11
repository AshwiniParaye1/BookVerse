/* eslint-disable @typescript-eslint/no-unused-vars */
//src/routes/borrow.ts

import express from "express";
import Borrow from "../models/Borrow";
import Book from "../models/Book";
import { auth } from "../middleware/auth";
import { AuthRequest } from "../middleware/auth";

const router = express.Router();

// Borrow a book
router.post(
  "/",
  auth,
  async (req: AuthRequest, res: express.Response): Promise<void> => {
    try {
      const { bookId } = req.body;
      const userId = req.user?.id;
      console.log("-----", bookId, userId);
      // Check if book exists and is available
      const book = await Book.findById(bookId);
      if (!book) {
        res.status(404).json({ error: "Book not found" });
        return;
      }
      if (!book.isAvailable) {
        res.status(400).json({ error: "Book is not available" });
        return;
      }

      // Create borrow record and update book availability
      const borrow = new Borrow({
        user: userId,
        book: bookId,
        borrowDate: new Date()
      });

      book.isAvailable = false;
      await Promise.all([borrow.save(), book.save()]);

      res.status(201).json(borrow);
    } catch (error) {
      console.log("errr", error);
      res.status(400).json({ error: "Error borrowing book" });
    }
  }
);

// Return a book
router.post(
  "/return/:id",
  auth,
  async (req: AuthRequest, res: express.Response): Promise<void> => {
    try {
      const borrow = await Borrow.findById(req.params.id);
      if (!borrow) {
        res.status(404).json({ error: "Borrow record not found" });
        return;
      }

      if (borrow?.user?.toString() !== req.user?.id) {
        res.status(403).json({ error: "Not authorized" });
        return;
      }

      if (borrow.isReturned) {
        res.status(400).json({ error: "Book already returned" });
        return;
      }

      // Update borrow record and book availability
      borrow.isReturned = true;
      borrow.returnDate = new Date();

      const book = await Book.findById(borrow.book);
      if (book) {
        book.isAvailable = true;
        await Promise.all([borrow.save(), book.save()]);
      }

      res.json(borrow);
    } catch (error) {
      res.status(400).json({ error: "Error returning book" });
    }
  }
);

// Get user's borrowed books
router.get("/user", auth, async (req: AuthRequest, res) => {
  try {
    console.log("req.user?.id", req.user?.id);
    const borrows = await Borrow.find({
      user: req.user?.id,
      isReturned: false
    }).populate("book");
    console.log("borrows", borrows);
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching borrowed books" });
  }
});

// Get most frequently borrowed books
router.get("/popular", async (req, res) => {
  try {
    const popularBooks = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails"
        }
      },
      { $unwind: "$bookDetails" }
    ]);
    res.json(popularBooks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching popular books" });
  }
});

export default router;
