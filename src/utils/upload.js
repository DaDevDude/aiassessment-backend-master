const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      let folderName = req.params.folderName; 
      const key =  folderName +"/" + Date.now().toString() + "-" + file.originalname.split(" ").join("");
      cb(null, key);
    },
  }),
});

const deleteFileFromS3 = (bucketName, fileName) => {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  
const getParamsFromFileUrl = (fileUrl) =>{
  const urlParts = new URL(fileUrl);
  const bucketName = urlParts.hostname.split(".")[0];
  const key = urlParts.pathname.substring(1);

  return {
    Bucket: bucketName,
    Key: key
  };
}

  const deleteFileUsingLocation = (req, res, next) => {
    try {
      const fileUrl = req.query.fileUrl;
      let params = getParamsFromFileUrl(fileUrl);
      s3.deleteObject(params, (err, data) => {
        if (err) {
          res.status(500).json({ error: "Failed to delete file" });
        } else {
          res.json({ message: "File deleted successfully", data: data });
        }
      });
    } catch (error) {
      next(error);
    }
  };


const getSignedUrl = (fileUrl) => {
  return new Promise((resolve, reject) => {
    let params = getParamsFromFileUrl(fileUrl);
 
    s3.headObject(params, (error, data) => {
      if (error) {
        //TODO:Add here image of file not found
        // const params = {
        //   Bucket: process.env.S3_BUCKET_NAME,
        //   Key: "system-files/file-not-found.png",
        //   Expires: 60,
        // };
        // const signedUrl = s3.getSignedUrl("getObject", params);
        reject("File Not Found");
      } else {
        params.Expires = 60;
        const signedUrl = s3.getSignedUrl("getObject", params);
        resolve(signedUrl);
      }
    });
  });
};
module.exports = {upload,deleteFileFromS3,deleteFileUsingLocation,getSignedUrl};
