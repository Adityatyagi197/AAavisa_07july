const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

/**
 * Generate a Presigned URL for Upload (Write-Once / Immutable)
 * Note: S3 Bucket policy and IAM roles should prevent s3:DeleteObject
 */
exports.generateUploadUrl = async (objectKey, contentType) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
    ContentType: contentType,
  });

  // URL expires in 15 minutes
  return await getSignedUrl(s3Client, command, { expiresIn: 900 });
};

/**
 * Generate a Presigned URL for Download
 */
exports.generateDownloadUrl = async (objectKey) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
  });

  // URL expires in 15 minutes (900 seconds)
  return await getSignedUrl(s3Client, command, { expiresIn: 900 });
};
