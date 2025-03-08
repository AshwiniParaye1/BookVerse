/* eslint-disable @typescript-eslint/no-unused-vars */

import express from "express";

const app = express();

//routes

app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to BookVerse!" });
});

export default app;
