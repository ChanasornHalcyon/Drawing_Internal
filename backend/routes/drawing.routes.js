const express = require("express");
const router = express.Router();
const { uploadDrawing } = require("../configs/multer");

const {
  pushData,
  checkDrawingNo,
  getAllData,
  searchDrawing,
  updateDrawing,
  getDrawingLogs,
  getDrawingHistory,
  deleteDrawingHistory,
} = require("../Controller/drawingController");


router.post("/pushData", uploadDrawing.single("file"), pushData);


router.get("/checkDrawingNo", checkDrawingNo);


router.get("/getAllData", getAllData);


router.post("/searchDrawing", searchDrawing);

router.put("/updateDrawing/:id", uploadDrawing.single("file"), updateDrawing);


router.get("/getDrawingLogs", getDrawingLogs);


router.get("/getDrawingHistory/:id", getDrawingHistory);


router.delete("/deleteDrawingHistory/:id", deleteDrawingHistory);

module.exports = router;
