"use strict";
//server/ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const user_1 = __importDefault(require("./routes/user"));
const book_1 = __importDefault(require("./routes/book"));
const borrow_1 = __importDefault(require("./routes/borrow"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect to MongoDB
(0, database_1.default)();
// Middleware
app.use(express_1.default.json());
// Routes
app.use("/api/users", user_1.default);
app.use("/api/books", book_1.default);
app.use("/api/borrows", borrow_1.default);
app.get("/", (req, res) => {
    res.json({ message: "Welcome to BookVerse!" });
});
const startServer = () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Listening on: ${port}`);
    });
};
startServer();
