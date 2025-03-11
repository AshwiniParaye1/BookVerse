/* eslint-disable @typescript-eslint/no-unused-vars */
//src/routes/book.ts

import express, { Request, RequestHandler, Response } from "express";
import Book from "../models/Book";
import { auth } from "../middleware/auth";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// Get all books with pagination
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      Book.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Book.countDocuments()
    ]);

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching books" });
  }
});

// Get a specific book
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Error fetching book" });
  }
});

// Create a new book (admin only)
router.post(
  "/",
  [auth as RequestHandler, checkRole(["admin"]) as RequestHandler],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const book = new Book(req.body);
      await book.save();
      res.status(201).json(book);
    } catch (error) {
      res.status(400).json({ error: "Error creating book" });
    }
  }
);

// Update a book (admin only)
router.put(
  "/:id",
  [auth as RequestHandler, checkRole(["admin"]) as RequestHandler],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!book) {
        res.status(404).json({ error: "Book not found" });
        return;
      }
      res.json(book);
    } catch (error) {
      res.status(400).json({ error: "Error updating book" });
    }
  }
);

// Delete a book (admin only)
router.delete(
  "/:id",
  [auth as RequestHandler, checkRole(["admin"]) as RequestHandler],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        res.status(404).json({ error: "Book not found" });
        return;
      }
      res.json({ message: "Book deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting book" });
    }
  }
);

export default router;
