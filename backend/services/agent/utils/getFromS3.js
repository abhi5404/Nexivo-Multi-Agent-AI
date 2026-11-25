import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.js";

export const getFromS3 = async (filename , expiresIn=600) => {
    return await getSignedUrl(s3, new getObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename
    }), { expiresIn })
}