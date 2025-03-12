"use strict";
//src/models/Book.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
// Create compound index for title and author for efficient searching
bookSchema.index({ title: "text", author: "text" });
const Book = mongoose_1.default.model("Book", bookSchema);
exports.default = Book;
