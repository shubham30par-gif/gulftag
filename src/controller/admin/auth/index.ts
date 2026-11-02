import { Router } from "express";
import Controller from "./auth.controller";
import { validateAuthEmailToken } from "../../../middlewares/validateAuthEmailToken";
import { validateIsAdmin } from "../../../middlewares/validateIsAdmin";

export default class AdminAuth extends Controller {
  public router = Router();
  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/login", this.login);
    this.router.post("/register", this.register);
    this.router.post(
      "/session",
      // validateAuthIdToken,
      validateAuthEmailToken,
      validateIsAdmin,
      this.session
    );
    this.router.post(
      "/logout",
      // validateAuthIdToken,
      validateAuthEmailToken,
      validateIsAdmin,
      this.logout
    );
  }
}
