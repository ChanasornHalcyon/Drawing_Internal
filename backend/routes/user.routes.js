const express = require("express");
const router = express.Router();

const {
  verifyUser,
  addUser,
  editUser,
  updatePassword,
  getUser,
  searchUser,
  deleteUser,
  userPermissions,
  savePermissions,
} = require("../Controller/userController");

router.post("/verifyUser", verifyUser);
router.post("/adduser", addUser);
router.post("/editUser", editUser);
router.put("/updatePassword", updatePassword);
router.get("/getUser", getUser);
router.get("/searchUser", searchUser);
router.delete("/deleteUser/:id", deleteUser);
router.get("/userPermissions", userPermissions);
router.post("/savePermissions", savePermissions);

module.exports = router;
