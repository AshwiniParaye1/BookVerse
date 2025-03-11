//src/models/Book.ts

import mongoose from "mongoose";

export interface IBook extends mongoose.Document {
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  isAvailable: boolean;
}

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true
    },
    author: {
      type: String,
      required: true,
      index: true
    },
    genre: {
      type: String,
      required: true
    },
    publishedYear: {
      type: Number,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Create compound index for title and author for efficient searching
bookSchema.index({ title: "text", author: "text" });

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
