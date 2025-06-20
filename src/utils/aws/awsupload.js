import { s3Client } from "./s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadToS3 = async (file, folder = "uploads") => {
  const bucketName = "exam-hertzworkz";
  const fileName = `${folder}/${Date.now()}_${file.name}`;
  const fileBody = await file.arrayBuffer(); 
  
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBody,
    ContentType: file.type,
  };
  
  try {
    await s3Client.send(new PutObjectCommand(params));
    const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`; 
    console.log("✅ File uploaded successfully:", fileUrl); 
    return fileUrl;
  } catch (error) {
    console.error("❌ Error uploading to S3:", error);
    throw new Error("Upload failed");
  }
};