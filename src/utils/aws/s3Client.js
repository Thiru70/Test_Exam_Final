import { S3Client } from "@aws-sdk/client-s3";

const REGION = "us-east-1";
const ACCESS_KEY_ID = "AKIA44Y6CHJMLMOWKNCL";
const SECRET_ACCESS_KEY = "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"
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  
});
 
export { s3Client };