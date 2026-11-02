import { AES, enc } from "crypto-js";
import { NextFunction, Response } from "express";
import { Request } from "../request";
import { getUserByEmail, getUserById, User } from "../modules/user";
import { set as setGlobalContext } from "express-http-context";

export const validateAuthEmailToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.headers.authorization ||
    req.signedCookies.auth ||
    req.signedCookies.admin_auth;

  if (!token) {
    res.clearCookie("admin_auth", {
      //httpOnly: true,
      // domain: "domainname",
      signed: true,
    });
    res
      .clearCookie("auth", {
        //httpOnly: true,
        // domain: "domainname",
        signed: true,
      })
      .status(403)
      .json({ message: "Unauthorized request." });
    return;
  }
  const userEmail = AES.decrypt(
    token,
    process.env.AES_ADMIN_KEY as string
  ).toString(enc.Utf8);
  // console.log("userEmail", userEmail);

  if (!userEmail) {
    res.clearCookie("admin_auth", {
      //httpOnly: true,
      // domain: "domainname",
      signed: true,
    });
    res
      .clearCookie("auth", {
        //httpOnly: true,
        // domain: "domainname",
        signed: true,
      })
      .status(403)
      .json({ message: "Unauthorized request." });
    return;
  }

  const user = await getUserByEmail(userEmail);
  // console.log("user", user);

  if (!user) {
    res.clearCookie("admin_auth", {
      //httpOnly: true,
      // domain: "domainname",
      signed: true,
    });
    res
      .clearCookie("auth", {
        //httpOnly: true,
        // domain: "domainname",
        signed: true,
      })
      .status(403)
      .json({ message: "Unauthorized request." });
    return;
  }
  const userRawData = user.toJSON();

  // delete userRawData.password;

  req.authUser = userRawData;
  req.isAdmin = userRawData.userType === "ADMIN";
  req.userId = userRawData._id;
  setGlobalContext("authUser", userRawData);

  next();
  return;
};
