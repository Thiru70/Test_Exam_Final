import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";


dotenv.config();

const REGION = "us-east-1";

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export { s3Client };
