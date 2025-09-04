import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config"; 
import { JWT_SECRET } from "@repo/backend-common/config";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: `token not found pls signup/signin` });
  }
  try {
    const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: `invalid token` });
  }
};

