import { Response } from "express";
import { Request } from "../../../request";
import StatusCodes from "http-status-codes";
import { get as _get } from "lodash";
import Joi, { isError } from "joi";
import { Types } from "mongoose";
import { deleteSinglePDF, getPdfById, getPdfByUrl } from "../../../modules/pdf";
import { saveManuals } from "../../../modules/manuals/saveManuals";
import {
  deleteManual,
  getManualById,
  getManualByUrl,
  Manuals,
  updateManual,
} from "../../../modules/manuals";
import { getManuals } from "../../../modules/manuals/getAllManuals";

export default class Controller {
  private manualsSchema = Joi.object({
    pdfURL: Joi.string().required(),
    pdfId: Joi.string()
      .custom(async (v: string) => {
        if (!v) return;
        const pdfExist = await getPdfById(v);
        if (!pdfExist) throw new Error("Pdf not found");
        return await pdfExist;
      })
      .required(),
    title: Joi.string().required(),
    subCategory: Joi.string().required(),
    type: Joi.string()
      .custom((v: string) => {
        return v.toLowerCase();
      })
      .valid("indoor", "outdoor", "airbunkers", "vionvr")
      .required(),
    isActive: Joi.boolean().optional(),
    language: Joi.string()
      .custom((value: string, helpers) => {
        const upper = value.toUpperCase();
        const allowed = ["ENG", "ARA"];

        if (!allowed.includes(upper)) {
          return helpers.error("any.invalid");
        }

        return upper; // This will be the final validated value
      })
      .required(),
  });
  private updateManualsSchema = Joi.object({
    pdfURL: Joi.string().optional(),
    pdfId: Joi.string().optional(),
    title: Joi.string().optional(),
    type: Joi.string()
      .custom((v: string) => {
        return v.toLowerCase();
      })
      .valid("indoor", "outdoor", "airbunkers", "vionvr")
      .optional(),
    isActive: Joi.boolean().optional(),
    subCategory: Joi.string().optional(),
    language: Joi.string()
      .custom((value: string, helpers) => {
        const upper = value.toUpperCase();
        const allowed = ["ENG", "ARA"];

        if (!allowed.includes(upper)) {
          return helpers.error("any.invalid");
        }

        return upper; // This will be the final validated value
      })
      .optional(),
  });
  protected readonly create = async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      const payloadValue = await this.manualsSchema
        .validateAsync(payload)
        .then((value) => {
          return value;
        })
        .catch((e) => {
          console.log(e);
          if (isError(e)) {
            res.status(422).json(e);
          } else {
            res.status(422).json({ message: e.message });
          }
        });
      if (!payloadValue) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid payload" });
      }
      const pdfid = await payloadValue.pdfId;
      const manual = await saveManuals(
        new Manuals({ ...payloadValue, pdfId: pdfid })
      );
      return res
        .status(StatusCodes.CREATED)
        .json({ message: "Manuals Created", result: manual, success: true });
    } catch (error) {
      console.log("error in Create Manuals", error);
      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };

  protected readonly update = async (req: Request, res: Response) => {
    try {
      if (!req.params.id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Empty or Invalid ID" });
      }
      const manualId = req.params.id;
      const payload = req.body;
      const payloadValue = await this.updateManualsSchema
        .validateAsync(payload)
        .then((value) => {
          return value;
        })
        .catch((e) => {
          console.log(e);
          if (isError(e)) {
            res.status(422).json(e);
          } else {
            res.status(422).json({ message: e.message });
          }
        });
      if (!payloadValue) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid payload" });
      }
      const updatedData: any = { _id: manualId.toString() };

      // Only include fields that are actually provided in the payload
      if (payloadValue.title !== undefined)
        updatedData.title = payloadValue.title;
      if (payloadValue.subCategory !== undefined)
        updatedData.subCategory = payloadValue.subCategory;
      if (payloadValue.type !== undefined) updatedData.type = payloadValue.type;
      if (payloadValue.isActive !== undefined)
        updatedData.isActive = payloadValue.isActive;
      if (payloadValue.language !== undefined)
        updatedData.language = payloadValue.language;
      if (payloadValue.pdfURL !== undefined)
        updatedData.pdfURL = payloadValue.pdfURL;

      // Handle pdfId separately - only update if provided
      if (payloadValue.pdfId) {
        const pdfIdString = await payloadValue?.pdfId.toString();

        const isExist: any = await getManualById(manualId);
        console.log(
          isExist?.pdfId?.toString(),
          pdfIdString?.toString(),
          "matched"
        );
        if (!isExist) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Manual not found", success: false });
        }
        if (isExist?.pdfId?._id?.toString() != pdfIdString) {
          console.log("Call delete single pdf", isExist, pdfIdString);

          const oldPdf = await getPdfByUrl(isExist?.pdfURL as string);

          await deleteSinglePDF(oldPdf?.pdfURL as string);
        }
        // Convert string to ObjectId for proper database storage
        updatedData.pdfId = new Types.ObjectId(pdfIdString);
      }

      const updated = await updateManual(new Manuals(updatedData));
      res.status(StatusCodes.OK).json({
        message: "Manual Updated Successfully",
        result: updated,
        success: true,
      });
    } catch (error) {
      console.log("error in Update Manuals", error);
      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };

  protected readonly delete = async (req: Request, res: Response) => {
    try {
      if (!req.params.id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Empty or Invalid ID" });
      }
      const manualId = req.params.id;
      const manual = await getManualById(manualId);

      if (!manual) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Manual not found", success: false });
      }
      const pdfExist = await getPdfByUrl(manual.pdfURL as string);
      console.log(pdfExist);

      if (!pdfExist) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "PDF is not exists", sucess: false });
      }
      await deleteSinglePDF(pdfExist.pdfURL as string);
      await deleteManual(manualId);
      res
        .status(StatusCodes.OK)
        .json({ message: "Manual Deleted Successfully", success: true });
    } catch (error) {
      console.log("error in Delete Manuals", error);
      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };
  protected readonly getSingle = async (req: Request, res: Response) => {
    try {
      if (!req.params.id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Empty or Invalid ID" });
      }
      const manualId = req.params.id;
      const manual = await getManualById(manualId);
      if (!manual) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Manual not found", success: false });
      }
      console.log(manual);

      return res
        .status(StatusCodes.OK)
        .json({ message: "Manual found", success: true, result: manual });
    } catch (error) {
      console.log("error in Get Manuals", error);
      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };
  protected readonly get = async (req: Request, res: Response) => {
    try {
      const manual = await getManuals();

      if (manual.length <= 0) {
        return res
          .status(StatusCodes.NO_CONTENT)
          .json({ message: "Manual not yet", success: true });
      }
      return res
        .status(StatusCodes.OK)
        .json({ message: "Manual fetched", success: true, result: manual });
    } catch (error) {
      console.log("error in Get Manuals", error);
      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };
}
