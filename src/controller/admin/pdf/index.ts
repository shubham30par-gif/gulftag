import { Router } from "express";
import Controller from "./controller";
import { validateAuthEmailToken } from "../../../middlewares/validateAuthEmailToken";
import { validateIsAdmin } from "../../../middlewares/validateIsAdmin";
import { filesUpload } from "../../../middlewares/filesUpload";

export class Pdf extends Controller {
  public router = Router();
  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/upload",
      validateAuthEmailToken,
      validateIsAdmin,
      filesUpload,
      this.upload
    );
    this.router.post(
      "/delete",
      validateAuthEmailToken,
      validateIsAdmin,
      this.deleteSingleFile
    );
    this.router.post(
      "/blob",
      validateAuthEmailToken,
      validateIsAdmin,
      this.getFileBlob
    );
  }
}
