import { Response } from "express";
import { Request } from "../../../request";
import {
  ContactUs,
  getContactUs,
  updateContactUs,
} from "../../../modules/contactUs";
import StatusCodes from "http-status-codes";
import { get as _get } from "lodash";
import Joi, { isError } from "joi";
export default class Controller {
  private updatedSchema = Joi.object().keys({
    status: Joi.string().valid("UNREAD", "READ", "REPLIED").optional(),
  });
  protected readonly get = async (req: Request, res: Response) => {
    try {
      const contacts = await getContactUs();
      if (contacts.length <= 0) {
        return res
          .status(StatusCodes.NO_CONTENT)
          .json({ message: "No Contacts Yet" });
      }
      return res
        .status(StatusCodes.OK)
        .json({ message: "Contact Us Fetched", result: contacts });
    } catch (error) {
      console.log("error in Admin Contact", error);
      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };
  protected readonly update = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const payloadValue = await this.updatedSchema
        .validateAsync(req.body)
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
          .json({ message: "Invalid or Empty Payload" });
      }
      console.log(payloadValue);

      const updatedContact = await updateContactUs(
        new ContactUs({ _id: id, status: payloadValue.status })
      );
      return res
        .status(StatusCodes.OK)
        .json({ message: "Contact Us updated", result: updatedContact });
    } catch (error) {
      console.log("error in update Contact", error);
      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };
}
