import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface requestExtended extends Request {
  userId: string;
}

export function authMiddleware(
  req: requestExtended,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;

  console.log(token);

  try {
    if (!token) {
      res.status(403).json({
        message: "No token found pls login",
      });
      return;
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    if (!decode) {
      res.json({ message: "Invalid credentials" });
      return;
    }

    req.userId = decode.userId;
    next();
  } catch (error) {
    console.log("Error in auth middleware", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
}
