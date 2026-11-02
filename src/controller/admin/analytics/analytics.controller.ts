import { Response } from "express";
import { Request } from "../../../request";
import { StatusCodes } from "http-status-codes";
import { get as _get } from "lodash";
import { getContactUs } from "../../../modules/contactUs";
import { ContactUsModel } from "../../../modules/contactUs/schema";
import { getAllManuals } from "../../../modules/manuals/getAllActiveManuals";
import { ManualsModel } from "../../../modules/manuals/schema";
import { UserModel } from "../../../modules/user/schema";
export default class Controller {
  protected readonly cardAnalytics = async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const response = await Promise.all([
        (await getContactUs()).length,
        (await getAllManuals()).length,
        (
          await ManualsModel.find({
            createdAt: { $gte: startOfMonth },
            isActive: true,
          })
        ).length,
      ]);
      const currentMonthData = await Promise.all([
        (
          await ManualsModel.find({
            createdAt: { $gte: startOfMonth },
            isActive: true,
          })
        ).length,
        (
          await ContactUsModel.find({ createdAt: { $gte: startOfMonth } })
        ).length,
      ]);
      const lastMonthData = await Promise.all([
        (
          await ManualsModel.find({
            createdAt: { $gte: lastMonth, $lt: startOfMonth },
            isActive: true,
          })
        ).length,
        (
          await ContactUsModel.find({
            createdAt: { $gte: lastMonth, $lt: startOfMonth },
          })
        ).length,
      ]);

      const difference = {
        manuals: currentMonthData[0] - lastMonthData[0],
        contactUs: currentMonthData[1] - lastMonthData[1],
      };
      const result = {
        totalContactUS: response[0],
        totalActiveManuls: response[1],
        currentMonthManuals: response[2],
        difference,
      };
      return res
        .status(StatusCodes.OK)
        .json({ message: "Card Analytics Fetched..", success: true, result });
    } catch (error) {
      console.log("error in get analytics", error);
      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };
  protected readonly listAnalytics = async (req: Request, res: Response) => {
    try {
      const response = await Promise.all([
        await ContactUsModel.find().sort({ createdAt: -1 }).limit(3),
        await ManualsModel.find({ isActive: true })
          .sort({ createdAt: -1 })
          .limit(3),
      ]);

      const result = {
        recentContactUs: response[0],
        recentActiveManuls: response[1],
      };
      return res
        .status(StatusCodes.OK)
        .json({ message: "List Analytics Fetched..", success: true, result });
    } catch (error) {
      console.log("error in get analytics", error);
      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };
}
