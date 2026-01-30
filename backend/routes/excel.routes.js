const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadExcel = multer({ storage: multer.memoryStorage() });
const { importExcel,exportUsers } = require("../Controller/excelController");

router.post("/importExcel", uploadExcel.single("excel"), importExcel);
router.get("/exportUsers", exportUsers);
module.exports = router;
