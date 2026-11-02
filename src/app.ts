import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import Admin from "./controller/admin";
import ContactUs from "./controller/contactUs";
import Manuals from "./controller/manuals";
import bodyParser from "body-parser";
export default class App {
  public static instance: express.Application;
  private static port: number;
  public static start(port: number) {
    this.instance = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeControllers();
  }
  private static initializeMiddlewares() {
    this.instance.use(
      cors({
        origin: true,
        credentials: true,
        exposedHeaders: "x-auth-token",
      })
    );
    this.instance.use(cookieParser(process.env.COOKIE_SECRET));
    this.instance.use(express.json({ limit: "50mb" }));
    this.instance.use(express.urlencoded({ limit: "50mb", extended: true }));
    this.instance.use(bodyParser.json({ limit: "50mb" }));
    this.instance.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.instance.set("views", path.join(__dirname, "views"));
    this.instance.set("view engine", "ejs");
    this.instance.use(express.static(process.cwd() + "/public"));
  }
  private static initializeControllers() {
    this.instance.use((req: Request, res: Response, next: NextFunction) => {
      const info =
        req.method +
        " " +
        req.url +
        " " +
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      console.log("API HIT -------------->", info, "\n|\nv\n|\nv\n");
      next();
    });
    this.instance.use("/admin", new Admin().instance);
    this.instance.use("/contactus", new ContactUs().router);
    this.instance.use("/manuals", new Manuals().router);
  }
}
