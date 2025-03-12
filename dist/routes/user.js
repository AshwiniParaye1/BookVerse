"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
//src/routes/user.ts
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
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
// Register a new user
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, role } = req.body;
        console.log(req.body);
        // Check if user already exists
        const existingUser = yield User_1.default.findOne({ username });
        if (existingUser) {
            res.status(400).json({ error: "Username already exists" });
            return; // Add return statement to stop execution
        }
        const user = new User_1.default({ username, password, role });
        yield user.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET);
        res
            .status(201)
            .json({ user: { id: user._id, username: user.username }, token });
    }
    catch (error) {
        console.log("error", error);
        res.status(400).json({ error: "Error creating user" });
    }
}));
// Login user
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            res.status(401).json({ error: "Invalid login credentials" });
            return; // Add return statement to stop execution
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid login credentials" });
            return; // Add return statement to stop execution
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET);
        res.json({ user: { id: user._id, username: user.username }, token });
    }
    catch (error) {
        res.status(400).json({ error: "Error logging in" });
    }
}));
// Get user profile
router.get("/profile", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Use req.user.id instead of req.params.id since this is coming from auth middleware
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select("-password");
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return; // Add return statement to stop execution
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching profile" });
    }
}));
exports.default = router;
