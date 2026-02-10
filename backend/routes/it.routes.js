const express = require("express");
const router = express.Router();

const {
  createITForm,
  createFixForm,
  getITForms,
  getFixForms,
  approveIT,
  getApproveITForms,
  getApproveFixForm,
  updateStatus,
  uploadPictures,
  rejectITForm,
  getCompleteITForms,
  getCompleteFixForms,
  getProblemForms,
  getProblemFixForms,
  dashboard,
} = require("../Controller/itController");

const { uploadIT, uploadFix } = require("../configs/multer");

router.post("/ITForm", createITForm);
router.post("/ITFixForm", createFixForm);

router.get("/getITForm", getITForms);
router.get("/getFixForm", getFixForms);

router.post("/ITApproveForm", approveIT);
router.get("/getApproveITForm", getApproveITForms);
router.get("/getApproveFixForm", getApproveFixForm);

router.put("/updateStatus/:id", updateStatus);

router.put("/upLoadPicture/:id",
  (req, res, next) => {
    const type = req.query.form_type;
    if (type === "FIX") {
      uploadFix.array("images", 10)(req, res, next);
    } else {
      uploadIT.array("images", 10)(req, res, next);
    }
  },
  uploadPictures,
);

router.post("/rejectITForm", rejectITForm);

router.get("/getCompleteForm", getCompleteITForms);
router.get("/getCompleteFixForm", getCompleteFixForms);

router.get("/getProblemForm", getProblemForms);
router.get("/getProblemFixForm", getProblemFixForms);

router.get("/ITDashboard", dashboard);

module.exports = router;
