const express = require("express");

const {
  downloadDocument,
  uploadFile
} = require("../controller/app");
const { upload } = require("../utils/upload");

const router = express.Router();

router.post('/upload-file/:folderName',upload.single('file'), uploadFile)
router.get("/download", downloadDocument);

module.exports = router;
