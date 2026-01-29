const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(process.cwd(), "backend", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storageDrawing = multer.diskStorage({
  destination: (req, file, cb) => {
    const name =
      req.body.customerName?.trim().replace(/\s+/g, "_") || "Unknown";
    const folder = path.join(uploadDir, name);
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => cb(null, file.originalname),
});
const uploadDrawing = multer({ storage: storageDrawing });

const itDir = path.join(uploadDir, "it");
if (!fs.existsSync(itDir)) fs.mkdirSync(itDir, { recursive: true });

const storageIT = multer.diskStorage({
  destination: (_, __, cb) => cb(null, itDir),
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname.replace(/[^\w]/g, "_")}`),
});
const uploadIT = multer({ storage: storageIT });


const fixDir = path.join(uploadDir, "fix");
if (!fs.existsSync(fixDir)) fs.mkdirSync(fixDir, { recursive: true });


const storageFix = multer.diskStorage({
  destination: (_, __, cb) => cb(null, fixDir),
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname.replace(/[^\w]/g, "_")}`),
});
const uploadFix = multer({ storage: storageFix });


const uploadExcel = multer({ storage: multer.memoryStorage() });

module.exports = { uploadDrawing, uploadIT, uploadFix, uploadExcel };
