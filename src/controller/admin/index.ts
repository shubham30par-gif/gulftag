import express, { Router } from "express";
import { validateAuthEmailToken } from "../../middlewares/validateAuthEmailToken";
import { validateIsAdmin } from "../../middlewares/validateIsAdmin";
import AdminAuth from "./auth";
import ContactUs from "./contactUs";
import { Pdf } from "./pdf";
import Manuals from "./manuals";
import Analytics from "./analytics";

export default class Admin {
  public instance: express.Application;
  public router = Router();

  constructor() {
    this.instance = express();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.instance.use("/auth", new AdminAuth().router);
    this.instance.use(
      "/contactus",
      validateAuthEmailToken,
      validateIsAdmin,
      new ContactUs().router
    );
    this.instance.use(
      "/pdf",
      validateAuthEmailToken,
      validateIsAdmin,
      new Pdf().router
    );
    this.instance.use(
      "/manuals",
      validateAuthEmailToken,
      validateIsAdmin,
      new Manuals().router
    );
    this.instance.use(
      "/analytics",
      validateAuthEmailToken,
      validateIsAdmin,
      new Analytics().router
    );
  }
}
