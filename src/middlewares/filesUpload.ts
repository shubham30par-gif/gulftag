import multer from "multer";
import { NextFunction, Response, Request } from "express";
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

export const filesUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.array("file", 1)(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    // const files = req.files.map((file) => ({
    //   fieldname: file.fieldname,
    //   originalname: file.originalname,
    //   encoding: file.encoding,
    //   mimeType: file.mimetype,
    //   buffer: file.buffer, // Get the buffer of the file
    //   size: file.size,
    //   filename: file.originalname,
    // }));

    req.body = req.body || {};
    req.body.files = req.files;
    next();
  });
};
