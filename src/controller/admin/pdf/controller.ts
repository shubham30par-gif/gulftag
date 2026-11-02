import { Response } from "express";
import { Request } from "../../../request";
import { get as _get } from "lodash";
import {
  createAndUploadPDF,
  deleteSinglePDF,
  getPdfById,
  getPdfByUrl,
} from "../../../modules/pdf";
import { StatusCodes } from "http-status-codes";
import { DeleteObjectCommand, S3, S3Client } from "@aws-sdk/client-s3";
import { PdfModel } from "../../../modules/pdf/schema";
import { getManualByUrl } from "../../../modules/manuals";

export default class Controller {
  protected readonly upload = async (req: Request, res: Response) => {
    try {
      const authUser = req.authUser;
      if (!authUser) {
        return res.status(403).json("unauthorized request !");
      }
      const file = req.body.files[0];
      if (!file.originalname.endsWith(".pdf")) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: "Invalid PDF, Please Upload PDF" });
      }

      // Validate original file size (reject if too large before processing)
      const MAX_SIZE = 4 * 1024 * 1024; // 4MB in bytes
      const originalSize = file.size || Buffer.byteLength(file.buffer);
      if (originalSize > MAX_SIZE * 2) {
        // Allow up to 8MB initially, compression should reduce it
        const sizeInMB = (originalSize / (1024 * 1024)).toFixed(2);
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: `PDF file is too large (${sizeInMB} MB). Maximum allowed size is 4 MB after compression.`,
        });
      }

      if (!authUser._id) return;
      const pdf = await createAndUploadPDF(file, authUser?._id);
      if (!pdf._id) return;
      const resPdf = await getPdfById(pdf._id);
      return res.status(200).json({ success: true, result: resPdf?.toJSON() });
    } catch (error) {
      console.log("########## Error in createPdf", error);
      const errorMessage = _get(error, "message", "Unknown error");

      // Check if it's a size validation error
      if (
        errorMessage.includes("exceeds the maximum allowed size") ||
        errorMessage.includes("too large")
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: errorMessage,
        });
      }

      return res.status(500).json({ error: errorMessage });
    }
  };
  protected readonly deleteSingleFile = async (req: Request, res: Response) => {
    try {
      const key = req.body.key as string; // expecting a single key like 'pdf/myfile.pdf'
      if (!key) {
        return res
          .status(400)
          .json({ error: "Missing file key in request body" });
      }
      console.log(key, "key");

      const isExist = await getPdfByUrl(key);
      if (!isExist) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "PDF is not exists.",
          success: false,
        });
      }
      const manual = await getManualByUrl(key);
      if (manual) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Manual is already created, you can not delete this PDF",
          success: false,
        });
      }
      await deleteSinglePDF(key);

      return res.status(200).json({
        message: "File deleted successfully",
        deleted: key,
      });
    } catch (err) {
      console.error("Error deleting file:", err);
      return res.status(500).json({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };
  // /api/manuals/proxy/:filename
  protected readonly getFileBlob = async (req: Request, res: Response) => {
    const key = req.body.key;

    if (!key) {
      return res.status(422).json({ message: "Invalid payload" });
    }
    const s3Url = `${process.env.BASE_URL}/${key}`;
    console.log(s3Url, "s3Url");

    try {
      const response = await fetch(s3Url);
      if (!response.ok) throw new Error("Fetch failed");

      const blob = await response.blob();
      const pdf = await getPdfByUrl(key);
      console.log(pdf);

      res.json({
        name: pdf?.title,
        type: blob.type,
        size: blob.size,
        lastModifid: blob.text,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch PDF" });
    }
  };
}
