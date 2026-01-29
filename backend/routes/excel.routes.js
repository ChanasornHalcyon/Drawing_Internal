const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadExcel = multer({ storage: multer.memoryStorage() });

const { importExcel } = require("../Controller/excel.controller");

router.post("/importExcel", uploadExcel.single("excel"), importExcel);

module.exports = router;
