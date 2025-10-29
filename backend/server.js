const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, res) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (allowed.includes(file.mimetype)) res(null, true);
    else res(new Error("Only images or PDFs are allowed!"));
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
  try {
    const [rows] = await db.query(
      "SELECT id, username, password FROM user WHERE username = ? AND password = ?",
      [username, password]
    );
    if (rows.length > 0) {
      res.json({
        success: true,
        user: rows[0],
      });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error("verifyUser Error:", err);
    res.status(500).json({ success: false });
  }
});

app.post("/pushData", upload.single("file"), async (req, res) => {
  try {
    const {
      employee_drawing,
      customerName,
      date,
      drawingNo,
      rev,
      customerPart,
      description,
      materialMain,
      materialSub,
      pcdGrade,
    } = req.body;

    let file_url = null;

    if (req.file) {
      const fileName = `${req.file.originalname}`;
      const { data, error } = await supabase.storage
        .from("drawings")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (error) throw error;

      const { data: publicURL } = supabase.storage
        .from("drawings")
        .getPublicUrl(fileName);

      file_url = publicURL.publicUrl;
    }

    const sql = `
      INSERT INTO drawing_records 
      (employee_drawing, customer_name, date, drawing_no, rev, customer_part_no, description,
       material_main, material_sub, pcd_grade, file_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      employee_drawing,
      customerName,
      date,
      drawingNo,
      rev,
      customerPart,
      description,
      materialMain,
      materialSub,
      pcdGrade,
      file_url,
    ]);

    res.json({
      success: true,
      message: "Drawing added and uploaded to Supabase!",
    });
  } catch (err) {
    console.error("pushData Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/getAllData", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM drawing_records ORDER BY id DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getAllData error:", err);
    res.status(500).json({ success: false });
  }
});

app.post("/searchDrawing", async (req, res) => {
  try {
    const {
      customerName,
      date,
      drawingNo,
      customerPart,
      description,
      materialMain,
      pcdGrade,
    } = req.body;

    let sql = "SELECT * FROM drawing_records WHERE 1=1";
    const params = [];

    if (customerName) {
      sql += " AND customer_name LIKE ?";
      params.push(`%${customerName}%`);
    }

    if (date) {
      sql += " AND DATE(date) = ?";
      params.push(date);
    }

    if (drawingNo) {
      sql += " AND drawing_no LIKE ?";
      params.push(`%${drawingNo}%`);
    }

    if (customerPart) {
      sql += " AND customer_part_no LIKE ?";
      params.push(`%${customerPart}%`);
    }

    if (description) {
      sql += " AND description LIKE ?";
      params.push(`%${description}%`);
    }

    if (materialMain) {
      sql += " AND material_main LIKE ?";
      params.push(`%${materialMain}%`);
    }

    if (pcdGrade) {
      sql += " AND pcd_grade LIKE ?";
      params.push(`%${pcdGrade}%`);
    }

    sql += " ORDER BY id ASC";

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("searchDrawing Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
