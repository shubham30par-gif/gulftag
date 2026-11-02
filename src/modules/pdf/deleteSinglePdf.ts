import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PdfModel } from "./schema";

export const deleteSinglePDF = async (key: string) => {
  const s3 = new S3Client({
    endpoint: process.env.S3_END_POINT,
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  };

  const command = new DeleteObjectCommand(params);
  const result = await s3.send(command);

  await PdfModel.deleteOne({ pdfURL: key });
};
