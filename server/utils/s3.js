const aws = require("aws-sdk");
const crypto = require("crypto");
const { promisify } = require("util");
const randomBytes = promisify(crypto.randomBytes);
require("dotenv").config();

const s3 = new aws.S3({
  region: process.env.awsRegion,
  accessKeyId: process.env.s3AccessKey,
  secretAccessKey: process.env.s3SecretAccessKey,
  signatureVersion: "v4",
});

async function generateS3UploadURL(req) {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");
  const uploadURL = await s3.getSignedUrlPromise("putObject", {
    Bucket: process.env.s3BucketName,
    Key: imageName,
    Expires: 60,
  });
  return uploadURL;
}

async function deleteS3Objects(urls) {
  const objects = urls.map((url) => ({
    Key: url.split("/").pop(),
  }));
  const params = {
    Bucket: process.env.s3BucketName,
    Delete: {
      Objects: objects,
      Quiet: false,
    },
  };

  await s3.deleteObjects(params).promise();
}

module.exports = { generateS3UploadURL, deleteS3Objects };
