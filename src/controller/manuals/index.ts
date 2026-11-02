import { Router } from "express";
import Controller from "./manuals.controller";

export default class Manuals extends Controller {
  public router = Router();
  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.get);
  }
}
