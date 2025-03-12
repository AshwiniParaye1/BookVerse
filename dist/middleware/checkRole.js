"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
//src/middleware/checkRole.ts
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
exports.checkRole = void 0;
const User_1 = __importDefault(require("../models/User"));
const checkRole = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Authentication required" });
            }
            const user = yield User_1.default.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            console.log("user.role======", user.role);
            if (!roles.includes(user.role)) {
                return res.status(403).json({ error: "Insufficient permissions" });
            }
            next();
        }
        catch (error) {
            res.status(500).json({ error: "Error checking permissions" });
        }
    });
};
exports.checkRole = checkRole;
