/* eslint-disable @typescript-eslint/no-unused-vars */
//src/middleware/checkRole.ts

import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import User from "../models/User";

export const checkRole = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: "Error checking permissions" });
    }
  };
};
