//src/models/Borrow.ts

import mongoose from "mongoose";
import { IBook } from "./Book";
import { IUser } from "./User";

export interface IBorrow extends mongoose.Document {
  user: IUser["_id"];
  book: IBook["_id"];
  borrowDate: Date;
  returnDate?: Date;
  isReturned: boolean;
}

const borrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true
    },
    borrowDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    returnDate: {
      type: Date
    },
    isReturned: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Create compound index for user and book for efficient querying
borrowSchema.index({ user: 1, book: 1 });

// Create index on isReturned field for querying active borrows
borrowSchema.index({ isReturned: 1 });

const Borrow = mongoose.model<IBorrow>("Borrow", borrowSchema);

export default Borrow;
