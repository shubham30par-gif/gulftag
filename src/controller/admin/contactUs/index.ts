import { Router } from "express";
import Controller from "./contactus.controller";
import { validateAuthEmailToken } from "../../../middlewares/validateAuthEmailToken";
import { validateIsAdmin } from "../../../middlewares/validateIsAdmin";
import StatusCodes from "http-status-codes";
import { get as _get } from "lodash";

export default class ContactUs extends Controller {
  public router = Router();
  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", validateAuthEmailToken, validateIsAdmin, this.get);
    this.router.patch("/:id",validateAuthEmailToken, validateIsAdmin, this.update)
  }
}
