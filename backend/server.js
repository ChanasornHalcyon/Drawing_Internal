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

app.get("/getUser", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, username, role,name FROM user");
    res.json({
      success: true,
      users: rows,
    });
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ success: false, message: "Server error" });
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
      price,
      cost,
      CoolantHole,
      Flute,
      Cloating,
      A1,
      A2,
      A3,
      D1,
      D2,
      D3,
      CL1,
      CL2,
      TL,
      type,
    } = req.body;

    let file_url = null;
    if (req.file) {
      const folder = customerName?.trim().replace(/\s+/g, "_") || "Unknown";
      file_url = `/uploads/${folder}/${req.file.originalname}`;
    }

    const sql = `
     INSERT INTO drawing_records 
(customer_name, date, drawing_no, rev, customer_part_no, description,
 material_main, price, cost, coolant_hole, flute, coating, file_url,
 A1, A2, A3, D1, D2, D3, CL1, CL2, TL, type)
 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

    `;

    await db.query(sql, [
      customerName,
      date,
      drawingNo,
      rev,
      customerPart,
      description,
      materialMain,
      price,
      cost,
      CoolantHole,
      Flute,
      Cloating,
      file_url,
      A1,
      A2,
      A3,
      D1,
      D2,
      D3,
      CL1,
      CL2,
      TL,
      type,
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
      startDate,
      endDate,
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
      type,
    } = req.body;

    let sql = "SELECT * FROM drawing_records WHERE 1=1";
    const params = [];

    if (customerName) {
      sql += " AND LOWER(customer_name) LIKE LOWER(?)";
      params.push(`%${customerName}%`);
    }

    if (startDate && endDate) {
      sql += " AND DATE(`date`) BETWEEN ? AND ?";
      params.push(startDate, endDate);
    } else if (startDate) {
      sql += " AND DATE(`date`) >= ?";
      params.push(startDate);
    } else if (endDate) {
      sql += " AND DATE(`date`) <= ?";
      params.push(endDate);
    }

    if (drawingNo) {
      sql += " AND LOWER(drawing_no) LIKE LOWER(?)";
      params.push(`%${drawingNo}%`);
    }
    if (rev) {
      sql += " AND LOWER(rev) LIKE LOWER(?)";
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
    if (type) {
      sql += " AND LOWER(type) LIKE LOWER(?)";
      params.push(`%${type}%`);
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

app.put("/updateDrawing/:id", upload.single("file"), async (req, res) => {
  const drawingId = req.params.id;
  const updatedData = req.body;
  const file = req.file;

  try {
    const formattedDate =
      updatedData.date && /^\d{4}-\d{2}-\d{2}$/.test(updatedData.date)
        ? updatedData.date
        : null;

    const [oldRows] = await db.query(
      "SELECT * FROM drawing_records WHERE id = ?",
      [drawingId]
    );

    if (!oldRows.length) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const oldData = oldRows[0];

    await db.query(
      `INSERT INTO drawing_history (drawing_id, modified_by, data)
       VALUES (?, ?, ?)`,
      [drawingId, updatedData.updated_by || "unknown", JSON.stringify(oldData)]
    );

    let fileUrl = oldData.file_url;

    if (file) {
      const customerFolder =
        updatedData.customer_name?.trim().replace(/\s+/g, "_") || "Unknown";

      const finalPath = path.join(uploadDir, customerFolder, file.originalname);

      if (!fs.existsSync(path.dirname(finalPath))) {
        fs.mkdirSync(path.dirname(finalPath), { recursive: true });
      }

      fs.renameSync(file.path, finalPath);

      fileUrl = `/uploads/${customerFolder}/${file.originalname}`;
    }

    await db.query(
      `
  UPDATE drawing_records
  SET 
    customer_name = ?, 
    date = ?, 
    drawing_no = ?, 
    rev = ?, 
    description = ?, 
    material_main = ?, 
    price = ?, 
    cost = ?,
    coolant_hole = ?, 
    flute = ?, 
    coating = ?,
    type = ?, 
    file_url = ?
  WHERE id = ?
`,
      [
        updatedData.customer_name,
        formattedDate,
        updatedData.drawing_no,
        updatedData.rev,
        updatedData.description,
        updatedData.material_main,
        updatedData.price,
        updatedData.cost,
        updatedData.coolant_hole,
        updatedData.flute,
        updatedData.coating,
        updatedData.type,
        fileUrl,
        drawingId,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/deleteDrawingHistory/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    if (id === 0) {
      const drawingId = req.query.drawingId;
      if (!drawingId) return res.status(400).json({ success: false });

      await db.query("DELETE FROM drawing_history WHERE drawing_id = ?", [
        drawingId,
      ]);
      await db.query("DELETE FROM drawing_records WHERE id = ?", [drawingId]);

      return res.json({ success: true });
    }
    await db.query("DELETE FROM drawing_history WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete history error:", err);
    res.status(500).json({ success: false });
  }
});

app.get("/getDrawingHistory/:id", async (req, res) => {
  const drawingId = req.params.id;
  try {
    const [currentRows] = await db.query(
      "SELECT *, NOW() AS modified_at FROM drawing_records WHERE id = ?",
      [drawingId]
    );
    const [historyRows] = await db.query(
      "SELECT * FROM drawing_history WHERE drawing_id = ? ORDER BY modified_at DESC",
      [drawingId]
    );

    const result = [];

    if (currentRows.length > 0) {
      const cur = currentRows[0];
      result.push({
        id: 0,
        modified_at: cur.modified_at,
        modified_by: cur.updated_by || "Current Version",
        data: JSON.stringify(cur),
      });
    }

    result.push(...historyRows);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
