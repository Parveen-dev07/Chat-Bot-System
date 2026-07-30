import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/S3..js";


export const getS3Url = async(key:string)=>{

    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key
    });


    const url = await getSignedUrl(
        s3,
        command,
        {
            expiresIn: 3000
        }
    );


    return url;
};