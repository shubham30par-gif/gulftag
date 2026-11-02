import Joi, { isError } from "joi";
import { getUserByEmail, IUser, saveUser, User } from "../../../modules/user";
import { AES, enc } from "crypto-js";
import { Response } from "express";
import { Request } from "../../../request";
import { get as _get } from "lodash";
import { getPopulatedUser } from "../../../modules/user/getPopulatedUser";
export default class Controller {
  private readonly loginSchema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .external(async (v: string) => {
        const user = await getUserByEmail(v);
        if (!user) {
          throw new Error(
            "This email address is not registered. Please use a registered email address."
          );
        }
        return user;
      }),
    password: Joi.string().required(),
  });

  private readonly registerSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    // otp: Joi.string().length(6).required(),
    email: Joi.string()
      .email()
      .required()
      .external(async (v: string) => {
        const user = await getUserByEmail(v);
        if (user) {
          throw new Error(
            "This email address is already associated with another account. Please use a different email address."
          );
        }
        return v;
      }),
    password: Joi.string()
      .required()
      .min(6)
      .custom((v) => {
        return AES.encrypt(v, process.env.PASS_KEY as string).toString();
      }),
  });

  protected readonly register = async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      const payloadValue = await this.registerSchema
        .validateAsync(payload)
        .then((value) => {
          return value;
        })
        .catch((e) => {
          console.log(e);
          if (isError(e)) {
            res.status(422).json(e);
          } else {
            res.status(422).json({ message: e.message });
          }
        });
      if (!payloadValue) {
        return;
      }

      const user = await saveUser(
        new User({
          ...payloadValue,
          userType: "ADMIN",
        })
      );
      const userEmail = user.email ? user.email.toString() : "";
      if (!userEmail) {
        throw new Error("User email is missing.");
      }
      const newUser = await getPopulatedUser(user._id);
      const token = AES.encrypt(
        userEmail,
        process.env.AES_ADMIN_KEY as string
      ).toString();
      // const token = AES.encrypt(
      //   user._id.toString(),
      //   process.env.AES_KEY
      // ).toString();
      res
        .cookie("auth", token, {
          expires: new Date("12/31/2100"),
          signed: true,
        })
        .status(200)
        .set({ "x-auth-token": token })
        .json(newUser);
    } catch (error) {
      console.log("error in register", error);
      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };

  protected readonly login = async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      const payloadValue = await this.loginSchema
        .validateAsync(payload)
        .then((value) => {
          return value;
        })
        .catch((e) => {
          console.log(e);
          if (isError(e)) {
            res.status(422).json(e);
          } else {
            res.status(422).json({ message: e.message });
          }
        });

      if (!payloadValue) {
        return;
      }
      const user = payloadValue.email;
      if (user.userType !== "ADMIN") {
        res.status(422).json({ message: "You are not admin" });
        return;
      }

      if (!user) {
        res.status(422).json({ message: "User not found" });
        return;
      }
      const password = AES.decrypt(
        user.password,
        process.env.PASS_KEY as string
      ).toString(enc.Utf8);
      if (password !== payloadValue.password) {
        res.status(422).json({ message: "Password is incorrect" });
        return;
      }

      const populatedUser = await getPopulatedUser(user._id);

      const token = AES.encrypt(
        user.email.toString(),
        process.env.AES_ADMIN_KEY as string
      ).toString();
      // const token = AES.encrypt(
      //   user._id.toString(),
      //   process.env.AES_KEY
      // ).toString();

      if (user.userType === "ADMIN") {
        res.cookie("admin_auth", token, {
          expires: new Date("12/31/2100"),
          signed: true,
        });
      }
      res
        .cookie("auth", token, {
          expires: new Date("12/31/2100"),
          signed: true,
        })
        .status(200)
        .setHeader("x-auth-token", token)
        .json({
          success: true,
          message: "Login Successfully",
          result: populatedUser,
        });
    } catch (error) {
      console.log("error in Admin_Login", error);
      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };

  protected readonly session = async (req: Request, res: Response) => {
    try {
      const isAdmin = req.isAdmin;

      if (!isAdmin) {
        res.status(403).json({ message: "Unauthorized request." }).end();
        return;
      }
      if (!req.authUser || !req.authUser._id) {
        res.status(422).json({ message: "Authenticated user not found." });
        return;
      }
      const user = await getPopulatedUser(req.authUser._id);
      res.status(200).json(user);
    } catch (error) {
      console.log("error at get session## ", error);

      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };

  protected readonly logout = async (req: Request, res: Response) => {
    try {
      const user = req.authUser;

      res.clearCookie("admin_auth", {
        signed: true,
      });
      res
        .clearCookie("auth", {
          signed: true,
        })
        .status(200)
        .json({ message: "Logout" });
    } catch (error) {
      console.log("error", "error in logout ", error);
      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };
}
