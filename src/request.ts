import { Request as expressRequest } from "express";
import { IUser } from "./modules/user";

export interface Request extends expressRequest {
  authUser?: IUser;
  userId?: string;
  isAdmin?: boolean;
  files?:
    | { [fieldname: string]: Express.Multer.File[] }
    | Express.Multer.File[];
}
