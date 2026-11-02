import { Router } from "express";
import Controller from "./manuals.controller";
import { validateAuthEmailToken } from "../../../middlewares/validateAuthEmailToken";
import { validateIsAdmin } from "../../../middlewares/validateIsAdmin";

export default class Manuals extends Controller {
  public router = Router();
  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.create);
    this.router.get("/",this.get)
    this.router.patch("/:id", this.update);
    this.router.delete("/:id", this.delete);
    this.router.get("/:id", this.getSingle);
  }
}
