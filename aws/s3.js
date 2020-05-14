const AWS = require("aws-sdk");
const { v4: uuidV4 } = require("uuid");
const fs = require("fs");

// configure S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

//S3 params --for using formdata --sent as file
//#region
/* 
exports.setS3Params = (image, type) => {
  const params = {
    Bucket: "yvonnkr-awsbucket1",
    Key: `category/${uuidV4()}`,
    Body: fs.readFileSync(image.path),
    ACL: "public-read",
    ContentType: `image/${type}`,
  };
  
  return params;
};
*/
//#endregion

//S3 params --for using base64 image --sent as json
exports.setS3Params = (base64Data, imageType) => {
  const params = {
    Bucket: "yvonnkr-awsbucket1",
    Key: `category/${uuidV4()}.${imageType}`,
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${imageType}`,
  };

  return params;
};

//S3 upload image
exports.s3UploadImage = async (params) => {
  try {
    const data = await s3.upload(params).promise();
    // console.log("AWS RESPONSE:", data);

    return data;
  } catch (error) {
    throw error;
  }
};

//S3 deleteObject
exports.s3DeleteObject = async (deleteParams) => {
  try {
    const data = await s3.deleteObject(deleteParams).promise();
    // console.log("S3 DELETED", data); // deleted

    return data;
  } catch (error) {
    throw error;
  }
};
