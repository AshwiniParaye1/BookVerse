"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
//src/routes/borrow.ts
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
const Borrow_1 = __importDefault(require("../models/Borrow"));
const Book_1 = __importDefault(require("../models/Book"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Borrow a book
router.post("/", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { bookId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log("-----", bookId, userId);
        // Check if book exists and is available
        const book = yield Book_1.default.findById(bookId);
        if (!book) {
            res.status(404).json({ error: "Book not found" });
            return;
        }
        if (!book.isAvailable) {
            res.status(400).json({ error: "Book is not available" });
            return;
        }
        // Create borrow record and update book availability
        const borrow = new Borrow_1.default({
            user: userId,
            book: bookId,
            borrowDate: new Date()
        });
        book.isAvailable = false;
        yield Promise.all([borrow.save(), book.save()]);
        res.status(201).json(borrow);
    }
    catch (error) {
        console.log("errr", error);
        res.status(400).json({ error: "Error borrowing book" });
    }
}));
// Return a book
router.post("/return/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const borrow = yield Borrow_1.default.findById(req.params.id);
        if (!borrow) {
            res.status(404).json({ error: "Borrow record not found" });
            return;
        }
        if (((_a = borrow === null || borrow === void 0 ? void 0 : borrow.user) === null || _a === void 0 ? void 0 : _a.toString()) !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
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
        const book = yield Book_1.default.findById(borrow.book);
        if (book) {
            book.isAvailable = true;
            yield Promise.all([borrow.save(), book.save()]);
        }
        res.json(borrow);
    }
    catch (error) {
        res.status(400).json({ error: "Error returning book" });
    }
}));
// Get user's borrowed books
router.get("/user", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log("req.user?.id", (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const borrows = yield Borrow_1.default.find({
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
            isReturned: false
        }).populate("book");
        console.log("borrows", borrows);
        res.json(borrows);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching borrowed books" });
    }
}));
// Get most frequently borrowed books
router.get("/popular", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const popularBooks = yield Borrow_1.default.aggregate([
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
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching popular books" });
    }
}));
exports.default = router;
