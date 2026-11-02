import { Types } from "mongoose";
// import { Audio, saveAudio } from "../audio";
import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";
import { PDF } from "./types";
import { savePdf } from "./savePdf";
interface UploadFileProps {
  filename: string;
  mimetype: string;
  encoding: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createReadStream: any;
}

/**
 *
 * @param file UploadFileProps
 * @param title
 * @returns PDF
 */
export const createAndUploadPDF = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: UploadFileProps | any,
  userId: string
): Promise<PDF> => {
  const s3 = new S3({
    endpoint: process.env.S3_END_POINT as string,
    region: process.env.AWS_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY as string,
      secretAccessKey: process.env.AWS_SECRET_KEY as string,
    },
  });
  const _id = new Types.ObjectId().toString();

  const uploadedPdf = await new Upload({
    client: s3,

    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `pdf/${Date.now() + "_" + _id + "_" + file.originalname}`,
      Body: file.buffer,
      ACL: "public-read",
    },
  }).done();
  //@ts-ignore
  const S3PdfURL = uploadedPdf.Key;
  const pdf = new PDF({
    _id,
    title: file.originalname || "Untitled",
    pdfURL: S3PdfURL,
    userId,
  });
  return await savePdf(pdf);
};
