const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const customerName =
      req.body.customerName?.trim().replace(/\s+/g, "_") || "Unknown";
    const customerFolder = path.join(uploadDir, customerName);

    if (!fs.existsSync(customerFolder)) {
      fs.mkdirSync(customerFolder, { recursive: true });
    }
    cb(null, customerFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only images or PDFs are allowed!"));
  },
});

let db;
const initMySQL = async () => {
  db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "khemnak1530",
    database: "halcyon_internal",
  });
};
initMySQL();

app.post("/verifyUser", async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query(
    "SELECT id, username, role FROM user WHERE username=? AND password=?",
    [username, password]
  );

  if (rows.length > 0) {
    res.json({ success: true, user: rows[0] });
  } else {
    res.json({ success: false });
  }
});

app.post("/pushData", upload.single("file"), async (req, res) => {
  try {
    const {
      customerName,
      date,
      drawingNo,
      rev,
      customerPart,
      description,
      materialMain,
      pcdGrade,
      price,
      cost,
      CoolantHole,
      Flute,
      Cloating,
      ShankMaterial,
      ShankShape,
    } = req.body;

    let file_url = null;
    if (req.file) {
      const folder = customerName?.trim().replace(/\s+/g, "_") || "Unknown";
      file_url = `/uploads/${folder}/${req.file.originalname}`;
    }

    const sql = `
      INSERT INTO drawing_records 
      (customer_name, date, drawing_no, rev, customer_part_no, description,
       material_main, pcd_grade, price, cost, coolant_hole, flute, coating,
       shank_material, shank_shape, file_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      customerName,
      date,
      drawingNo,
      rev,
      customerPart,
      description,
      materialMain,
      pcdGrade,
      price,
      cost,
      CoolantHole,
      Flute,
      Cloating,
      ShankMaterial,
      ShankShape,
      file_url,
    ]);

    res.json({ success: true, message: "Drawing uploaded successfully!" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/getAllData", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM drawing_records ORDER BY id DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.post("/searchDrawing", async (req, res) => {
  try {
    const {
      customerName,
      date,
      drawingNo,
      rev,
      customerPart,
      description,
      materialMain,
      pcdGrade,
      coolantHole,
      flute,
      cloating,
      shankMaterial,
      shankShape,
    } = req.body;

    let sql = "SELECT * FROM drawing_records WHERE 1=1";
    const params = [];

    if (customerName) {
      sql += " AND LOWER(customer_name) LIKE LOWER(?)";
      params.push(`%${customerName}%`);
    }

    if (date) {
      sql += " AND DATE(`date`) = ?";
      params.push(date);
    }

    if (drawingNo) {
      sql += " AND LOWER(drawing_no) LIKE LOWER(?)";
      params.push(`%${drawingNo}%`);
    }
    if (rev) {
      sql += " AND LOWER(drawing_no) LIKE LOWER(?)";
      params.push(`%${rev}%`);
    }
    if (customerPart) {
      sql += " AND LOWER(customer_part_no) LIKE LOWER(?)";
      params.push(`%${customerPart}%`);
    }

    if (description) {
      sql += " AND LOWER(description) LIKE LOWER(?)";
      params.push(`%${description}%`);
    }

    if (materialMain) {
      sql += " AND LOWER(material_main) LIKE LOWER(?)";
      params.push(`%${materialMain}%`);
    }

    if (pcdGrade) {
      sql += " AND LOWER(pcd_grade) LIKE LOWER(?)";
      params.push(`%${pcdGrade}%`);
    }
    if (coolantHole) {
      sql += " AND LOWER(coolant_hole) LIKE LOWER(?)";
      params.push(`%${coolantHole}%`);
    }

    if (flute) {
      sql += " AND LOWER(flute) LIKE LOWER(?)";
      params.push(`%${flute}%`);
    }

    if (cloating) {
      sql += " AND LOWER(coating) LIKE LOWER(?)";
      params.push(`%${cloating}%`);
    }

    if (shankMaterial) {
      sql += " AND LOWER(shank_material) LIKE LOWER(?)";
      params.push(`%${shankMaterial}%`);
    }

    if (shankShape) {
      sql += " AND LOWER(shank_shape) LIKE LOWER(?)";
      params.push(`%${shankShape}%`);
    }

    sql += " ORDER BY id ASC";

    const [rows] = await db.query(sql, params);

    if (rows.length === 0) {
      return res.json({ success: false, message: "ไม่พบข้อมูลตามเงื่อนไข" });
    }

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/updateDrawing/:id", async (req, res) => {
  const id = req.params.id;
  const {
    customerName,
    date,
    drawingNo,
    rev,
    customerPart,
    description,
    materialMain,
    pcdGrade,
    CoolantHole,
    Flute,
    Cloating,
    ShankMaterial,
    ShankShape,
  } = req.body;

  try {
    const formattedDate = date
      ? new Date(date).toISOString().split("T")[0]
      : null;

    const sql = `
      UPDATE drawing_records
      SET
        customer_name   = COALESCE(?, customer_name),
        date            = COALESCE(?, date),
        drawing_no      = COALESCE(?, drawing_no),
        rev             = COALESCE(?, rev),
        customer_part_no= COALESCE(?, customer_part_no),
        description     = COALESCE(?, description),
        material_main   = COALESCE(?, material_main),
        pcd_grade       = COALESCE(?, pcd_grade),
        coolant_hole    = COALESCE(?, coolant_hole),
        flute           = COALESCE(?, flute),
        coating         = COALESCE(?, coating),
        shank_material  = COALESCE(?, shank_material),
        shank_shape     = COALESCE(?, shank_shape)
      WHERE id = ?
    `;

    await db.query(sql, [
      customerName || null,
      formattedDate,
      drawingNo || null,
      rev || null,
      customerPart || null,
      description || null,
      materialMain || null,
      pcdGrade || null,
      CoolantHole || null,
      Flute || null,
      Cloating || null,
      ShankMaterial || null,
      ShankShape || null,
      id,
    ]);

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
