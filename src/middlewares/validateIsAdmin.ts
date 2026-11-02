import { NextFunction, Response } from "express";
import { Request } from "../request";

export const validateIsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.authUser);

  if (!req.isAdmin) {
    res.status(403).json({ message: "Unauthorized requests." }).end();
    return;
  }
  next();
};
