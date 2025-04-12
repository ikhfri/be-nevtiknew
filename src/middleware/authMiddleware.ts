import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../libs/jwt";
import cookieParser from "cookie-parser";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res
      .status(403)
      .json({ message: "Forbidden: Invalid or expired token" });
  }

  (req as any).user = decoded; 
  next();
};
