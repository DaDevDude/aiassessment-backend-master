const { default: axios } = require("axios");
const { getSignedUrl } = require("../utils/upload");

const downloadDocument = async (req, res) => {
    try {
      const { fileUrl } = req.query;
      console.log("fileUrl",fileUrl);
      const signedUrl = await getSignedUrl(fileUrl);
      console.log("signedUrl", signedUrl);
      // const response = await axios.get(signedUrl, { responseType: "stream" });
      // console.log("response", response);
      // response.data.pipe(res);
      return res.status(200).json({status: "success", data: signedUrl});
    } catch (error) {
      console.log("ERrror", error);
      // next(error)
    }
  };
  const uploadFile = (req,res,next) => {
    try {
      let location = process.env.SERVER_URL +'/api/app' + `/download?fileUrl=${req.file.location}`;
      res.status(200).json({ status:"success",url:location })
    } catch (error) {
      console.log("error",error);
      next(error)
    }
  }
  module.exports = {downloadDocument,uploadFile}