"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
//src/routes/book.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Book_1 = __importDefault(require("../models/Book"));
const auth_1 = require("../middleware/auth");
const checkRole_1 = require("../middleware/checkRole");
const router = express_1.default.Router();
// Get all books with pagination
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [books, total] = yield Promise.all([
            Book_1.default.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            Book_1.default.countDocuments()
        ]);
        res.json({
            books,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalBooks: total
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching books" });
    }
}));
// Search books by title or author
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query) {
            res.status(400).json({ error: "Search query is required" });
            return;
        }
        const books = yield Book_1.default.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { author: { $regex: query, $options: "i" } }
            ]
        });
        res.json(books);
    }
    catch (error) {
        res.status(500).json({ error: "Error searching books" });
    }
}));
// Get a specific book
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book_1.default.findById(req.params.id);
        if (!book) {
            res.status(404).json({ error: "Book not found" });
            return;
        }
        res.json(book);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching book" });
    }
}));
// Create a new book (admin only)
router.post("/", [auth_1.auth, (0, checkRole_1.checkRole)(["admin"])], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const book = new Book_1.default(req.body);
        yield book.save();
        res.status(201).json(book);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: "Error creating book" });
    }
}));
// Update a book (admin only)
router.put("/:id", [auth_1.auth, (0, checkRole_1.checkRole)(["admin"])], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!book) {
            res.status(404).json({ error: "Book not found" });
            return;
        }
        res.json(book);
    }
    catch (error) {
        res.status(400).json({ error: "Error updating book" });
    }
}));
// Delete a book (admin only)
router.delete("/:id", [auth_1.auth, (0, checkRole_1.checkRole)(["admin"])], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book_1.default.findByIdAndDelete(req.params.id);
        if (!book) {
            res.status(404).json({ error: "Book not found" });
            return;
        }
        res.json({ message: "Book deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting book" });
    }
}));
exports.default = router;
