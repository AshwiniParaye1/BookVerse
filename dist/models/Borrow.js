"use strict";
//src/models/Borrow.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const borrowSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    book: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
// Create compound index for user and book for efficient querying
borrowSchema.index({ user: 1, book: 1 });
// Create index on isReturned field for querying active borrows
borrowSchema.index({ isReturned: 1 });
const Borrow = mongoose_1.default.model("Borrow", borrowSchema);
exports.default = Borrow;
