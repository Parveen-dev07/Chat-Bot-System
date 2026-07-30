import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/S3..js";

export const UploadService = {
  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new Error("File is required");
    }

    try {
        const fileName = `${Date.now()}-${file.originalname}`;
 console.log("show bucket name from middleware---->",process.env.S3_BUCKET_NAME);

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    return {
      fileName,
      contentType: file.mimetype,
      size: file.size,
    };
    } catch (error:any) {
        throw new Error(error)  
    }
    
  },
};