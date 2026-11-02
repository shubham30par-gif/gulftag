import { Response } from "express";
import StatusCodes from "http-status-codes";
import { get as _get, cond } from "lodash";
import Joi, { isError } from "joi";
import { Request } from "../../request";
import { getManualsTypeWise } from "../../modules/manuals/getManualsTypeWise";
import { getAllManuals } from "../../modules/manuals";

export default class Controller {
  protected readonly get = async (req: Request, res: Response) => {
    try {
      const query = req.query;
      const condition: { type?: string; isActive: boolean } = {
        isActive: true,
      };

      if (query.type !== "All") {
        if (typeof query.type === "string") {
          condition.type = query.type;
        } else if (
          Array.isArray(query.type) &&
          typeof query.type[0] === "string"
        ) {
          condition.type = query.type[0];
        }
      }

      const data = await getManualsTypeWise(condition);
      if (data.length <= 0) {
        return res
          .status(StatusCodes.OK)
          .json({ message: "Manuals not found", success: true });
      }
      return res
        .status(StatusCodes.OK)
        .json({ message: "Manual fetched", success: true, result: data });
    } catch (error) {
      console.log("error in get Manuals", error);
      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };
}
