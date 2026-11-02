import { Router } from "express";
import Controller from "./analytics.controller";
import { validateAuthEmailToken } from "../../../middlewares/validateAuthEmailToken";
import { validateIsAdmin } from "../../../middlewares/validateIsAdmin";

export default class Analytics extends Controller {
  public router = Router();
  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/card", this.cardAnalytics);
    this.router.get("/list", this.listAnalytics);
  }
}
