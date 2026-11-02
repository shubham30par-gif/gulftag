import { Router } from "express";
import Controller from "./contactus.controller";

export default class ContactUs extends Controller {
  public router = Router();
  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.create);
  }
}
