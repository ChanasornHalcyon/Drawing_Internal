const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
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
const transporter = nodemailer.createTransport({
  host: "mail.halcyon.local",
  port: 587,
  secure: false,
  auth: {
    user: "itservice@halcyon.local",
    pass: "H@lcyon2026",
  },
  tls: {
    rejectUnauthorized: false,
  },
});
app.post("/verifyUser", async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query(
    "SELECT id, username, role,department,firstname,lastname FROM user WHERE username=? AND password=?",
    [username, password],
  );

  if (rows.length > 0) {
    res.json({ success: true, user: rows[0] });
  } else {
    res.json({ success: false });
  }
});

app.post("/addUser", async (req, res) => {
  const {
    email,
    nickname,
    firstname,
    lastname,
    username,
    password,
    role,
    department,
    section,
    level,
  } = req.body;
  try {
    await db.query(
      "INSERT INTO user (email,nickname,firstname,lastname, username, password, role,department,section,level) VALUES (?, ?, ?, ?,?,?,?,?,?,?)",
      [
        email,
        nickname,
        firstname,
        lastname,
        username,
        password,
        role,
        department,
        section,
        level,
      ],
    );
    res.json({ success: true, message: "User added" });
  } catch (err) {
    console.error("Add user error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.post("/editUser", async (req, res) => {
  const {
    id,
    email,
    nickname,
    firstname,
    lastname,
    username,
    password,
    role,
    department,
    section,
    level,
  } = req.body;

  try {
    let query = `
      UPDATE user
      SET email=?, nickname=?, firstname=?, lastname=?, 
          username=?, role=?, department=?, section=?, level=?`;

    const params = [
      email,
      nickname,
      firstname,
      lastname,
      username,
      role,
      department,
      section,
      level,
    ];

    if (password && password.trim() !== "") {
      query += `, password=?`;
      params.push(password);
    }

    query += ` WHERE id=?`;
    params.push(id);

    await db.query(query, params);

    res.json({ success: true, message: "User updated" });
  } catch (err) {
    console.error("Edit user error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/updatePassword", async (req, res) => {
  const { id, password } = req.body;
  try {
    await db.query("UPDATE user SET password = ? WHERE id = ?", [password, id]);
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/getUser", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id,email, username, role,nickname,firstname,lastname,department,section,level FROM user",
    );
    res.json({
      success: true,
      users: rows,
    });
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/searchUser", async (req, res) => {
  const { keyword } = req.query;
  try {
    const search = `%${keyword}%`;

    const [rows] = await db.query(
      `
      SELECT 
        id,
        username,
        email,
        firstname,
        lastname,
        nickname,
        role,
        department,
        section,
        level
      FROM user
      WHERE 
        username LIKE ? OR
        email LIKE ? OR
        firstname LIKE ? OR
        lastname LIKE ? OR
        nickname LIKE ?
      ORDER BY id DESC
      `,
      [search, search, search, search, search]
    );

    res.json({ success: true, users: rows });
  } catch (err) {
    console.error("Search user error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



app.delete("/deleteUser/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM user WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete user error:", err);
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
      username,
    } = req.body;

    let file_url = null;

    if (req.file) {
      const folder = customerName?.trim().replace(/\s+/g, "_") || "Unknown";
      file_url = `/uploads/${folder}/${req.file.originalname}`;
    }

    const insertSQL = `
      INSERT INTO drawing_records 
      (customer_name, date, drawing_no, rev, customer_part_no, description,
       material_main, price, cost, coolant_hole, flute, coating, file_url,
       A1, A2, A3, D1, D2, D3, CL1, CL2, TL, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(insertSQL, [
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

    const newId = result.insertId;
    const logSQL = `
      INSERT INTO drawing_logs (drawing_id, action_type, action_by, action_detail)
      VALUES (?, 'ADD', ?, ?)
    `;

    const actionDetail = JSON.stringify({
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
    });

    await db.query(logSQL, [newId, username, actionDetail]);

    res.json({
      success: true,
      message: "Drawing uploaded successfully!",
      drawing_id: newId,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.get("/getDrawingLogs", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, drawing_id, action_type, action_by, action_detail, created_at
      FROM drawing_logs
      ORDER BY created_at DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Get Logs Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/checkDrawingNo", async (req, res) => {
  try {
    const { drawingNo } = req.query;

    const sql = `SELECT COUNT(*) AS count FROM drawing_records WHERE drawing_no = ?`;
    const [rows] = await db.query(sql, [drawingNo]);

    res.json({ exists: rows[0].count > 0 });
  } catch (err) {
    console.error("Check error:", err);
    res.status(500).json({ exists: false });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/getAllData", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM drawing_records ORDER BY id DESC",
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
      A1,
      A2,
      A3,
      D1,
      D2,
      D3,
      CL1,
      CL2,
      TL,
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
    if (A1) {
      sql += " AND LOWER(A1) LIKE LOWER(?)";
      params.push(`%${A1}%`);
    }
    if (A2) {
      sql += " AND LOWER(A2) LIKE LOWER(?)";
      params.push(`%${A2}%`);
    }
    if (A3) {
      sql += " AND LOWER(A3) LIKE LOWER(?)";
      params.push(`%${A3}%`);
    }

    if (D1) {
      sql += " AND LOWER(D1) LIKE LOWER(?)";
      params.push(`%${D1}%`);
    }
    if (D2) {
      sql += " AND LOWER(D2) LIKE LOWER(?)";
      params.push(`%${D2}%`);
    }
    if (D3) {
      sql += " AND LOWER(D3) LIKE LOWER(?)";
      params.push(`%${D3}%`);
    }

    if (CL1) {
      sql += " AND LOWER(CL1) LIKE LOWER(?)";
      params.push(`%${CL1}%`);
    }
    if (CL2) {
      sql += " AND LOWER(CL2) LIKE LOWER(?)";
      params.push(`%${CL2}%`);
    }

    if (TL) {
      sql += " AND LOWER(TL) LIKE LOWER(?)";
      params.push(`%${TL}%`);
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
      [drawingId],
    );

    if (!oldRows.length) {
      return res.status(404).json({ success: false });
    }

    const oldData = oldRows[0];

    // ⛔ เก็บประวัติก่อนแก้ไข → 1 ครั้งพอ
    await db.query(
      `INSERT INTO drawing_history (drawing_id, modified_by, data)
       VALUES (?, ?, ?)`,
      [drawingId, updatedData.updated_by || "unknown", JSON.stringify(oldData)],
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

    // UPDATE drawing
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
        A1 = ?, 
        A2 = ?, 
        A3 = ?, 
        D1 = ?, 
        D2 = ?, 
        D3 = ?, 
        CL1 = ?, 
        CL2 = ?, 
        TL = ?, 
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
        updatedData.A1,
        updatedData.A2,
        updatedData.A3,
        updatedData.D1,
        updatedData.D2,
        updatedData.D3,
        updatedData.CL1,
        updatedData.CL2,
        updatedData.TL,
        fileUrl,
        drawingId,
      ],
    );

    // LOG (ข้อมูลก่อนแก้ไข)
    const oldDatas = {
      customerName: oldData.customer_name,
      drawingNo: oldData.drawing_no,
      rev: oldData.rev,
      customerPart: oldData.customer_part_no,
      description: oldData.description,
      materialMain: oldData.material_main,
      price: oldData.price,
      cost: oldData.cost,
      CoolantHole: oldData.coolant_hole,
      Flute: oldData.flute,
      type: oldData.type,
      file_url: oldData.file_url,
    };

    await db.query(
      `INSERT INTO drawing_logs (drawing_id, action_type, action_by, action_detail)
       VALUES (?, 'EDIT', ?, ?)`,
      [
        drawingId,
        updatedData.updated_by || "unknown",
        JSON.stringify(oldDatas),
      ],
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.delete("/deleteDrawingHistory/:id", async (req, res) => {
  const id = Number(req.params.id);
  const deletedBy = req.query.deleted_by || "unknown";

  try {
    if (id === 0) {
      const drawingId = req.query.drawingId;

      const [rows] = await db.query(
        "SELECT * FROM drawing_records WHERE id = ?",
        [drawingId],
      );

      let detail = {};
      if (rows.length) {
        const old = rows[0];
        detail = {
          customerName: old.customer_name || "",
          drawingNo: old.drawing_no || "",
          rev: old.rev || "",
          customerPart: old.customer_part_no || "",
          description: old.description || "",
          materialMain: old.material_main || "",
          price: old.price || "",
          cost: old.cost || "",
          CoolantHole: old.coolant_hole || "",
          Flute: old.flute || "",
          type: old.type || "",
          file_url: old.file_url || "",
        };
      }

      await db.query(
        `INSERT INTO drawing_logs (drawing_id, action_type, action_by, action_detail)
         VALUES (?, 'DELETE', ?, ?)`,
        [
          drawingId,
          deletedBy,
          JSON.stringify({
            reason: "Delete all history + record",
            data_before_delete: detail,
          }),
        ],
      );

      await db.query("DELETE FROM drawing_history WHERE drawing_id = ?", [
        drawingId,
      ]);
      await db.query("DELETE FROM drawing_records WHERE id = ?", [drawingId]);

      return res.json({ success: true });
    }

    const [rows] = await db.query(
      "SELECT * FROM drawing_history WHERE id = ?",
      [id],
    );

    if (!rows.length) {
      return res.status(404).json({ success: false });
    }

    const deletedRow = rows[0];
    const drawingId = deletedRow.drawing_id;

    let parsed = {};
    try {
      parsed = JSON.parse(deletedRow.data);
    } catch {
      parsed = {};
    }

    const detail = {
      customerName: parsed.customer_name || "",
      drawingNo: parsed.drawing_no || "",
      rev: parsed.rev || "",
      customerPart: parsed.customer_part_no || "",
      description: parsed.description || "",
      materialMain: parsed.material_main || "",
      price: parsed.price || "",
      cost: parsed.cost || "",
      CoolantHole: parsed.coolant_hole || "",
      Flute: parsed.flute || "",
      type: parsed.type || "",
      file_url: parsed.file_url || "",
    };

    await db.query(
      `INSERT INTO drawing_logs (drawing_id, action_type, action_by, action_detail)
       VALUES (?, 'DELETE', ?, ?)`,
      [
        drawingId,
        deletedBy,
        JSON.stringify({
          deleted_history_id: id,
          data_before_delete: detail,
          deleted_at: new Date(),
        }),
      ],
    );

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
      [drawingId],
    );

    const [historyRows] = await db.query(
      "SELECT * FROM drawing_history WHERE drawing_id = ? ORDER BY modified_at DESC",
      [drawingId],
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

app.post("/ITForm", async (req, res) => {
  try {
    const {
      purpose,
      detail,
      reason,
      spec,
      requester,
      department,
      request_date,
      required_date,
    } = req.body;

    await db.query(
      `INSERT INTO it_requests
       (purpose, detail, reason, spec, requester, department, request_date, required_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
      [
        purpose,
        detail,
        reason,
        spec,
        requester,
        department,
        request_date,
        required_date,
      ],
    );

    const [approvers] = await db.query(`
      SELECT department, email
      FROM user
      WHERE level >= 2
        AND email IS NOT NULL
    `);

    const departmentMap = {};

    approvers.forEach((user) => {
      if (!departmentMap[user.department]) {
        departmentMap[user.department] = [];
      }
      departmentMap[user.department].push(user.email);
    });

    const pendingUrl = "http://localhost:3000/Pending_Form";

    for (const dept in departmentMap) {
      const emailList = departmentMap[dept].join(",");

      await transporter.sendMail({
        from: `"IT System" <itservice@halcyon.local>`,
        to: emailList,
        subject: `มีคำขอ IT ใหม่ (${department})`,
        html: `
          <h3>มีคำขอ IT ใหม่</h3>
          <p><b>ผู้ร้องขอ:</b> ${requester}</p>
          <p><b>แผนกผู้ร้องขอ:</b> ${department}</p>
          <p><b>วัตถุประสงค์:</b> ${purpose}</p>
          <p><b>รายละเอียด:</b> ${detail}</p>
          <p><b>เหตุผล:</b> ${reason}</p>
          <p><b>Spec:</b> ${spec}</p>
          <p><b>วันที่ร้องขอ:</b> ${request_date}</p>
          <hr />
          <p>ส่งถึงผู้อนุมัติแผนก: <b>${dept}</b></p>
          <a href="${pendingUrl}"
             style="
               display:inline-block;
               padding:10px 18px;
               background:#22c55e;
               color:#fff;
               text-decoration:none;
               border-radius:6px;
               font-weight:600;
             ">
            ไปที่หน้า Pending Form
          </a>
        `,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("ITForm Error:", err);
    res.status(500).json({ success: false });
  }
});

app.get("/getITForm", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT *
       FROM it_requests
        ORDER BY created_at DESC`,
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get("/getApproveITForm", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM it_requests
      WHERE status IN ("APPROVED", "IN_PROGRESS")
      ORDER BY request_date DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get("/getCompleteForm", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT *
       FROM it_requests WHERE status ="COMPLETE"
       ORDER BY request_date DESC`,
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get("/getProblemForm", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT *
FROM it_requests
WHERE status IN ("PROBLEM", "REJECTED")
ORDER BY created_at DESC;
`,
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get("/getProblemFixForm", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT *
       FROM it_fixrequest WHERE status ="PROBLEM"
       ORDER BY  created_at DESC`,
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});
app.put("/updateStatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, username, form_type, problem_detail } = req.body;

    const table = form_type === "FIX" ? "it_fixrequest" : "it_requests";

    let sql = "";
    let params = [];

    if (status === "IN_PROGRESS") {
      sql = `
        UPDATE ${table}
        SET status = ?, started_by = ?, started_at = NOW()
        WHERE id = ?
      `;
      params = [status, username, id];
    } else if (status === "COMPLETE") {
      sql = `
        UPDATE ${table}
        SET status = ?, completed_by = ?, completed_at = NOW()
        WHERE id = ?
      `;
      params = [status, username, id];
    } else if (status === "PROBLEM") {
      sql = `
        UPDATE ${table}
        SET status = ?, problem_detail = ?, problem_by = ?, problem_at = NOW()
        WHERE id = ?
      `;
      params = [status, problem_detail, username, id];
    } else {
      sql = `
        UPDATE ${table}
        SET status = ?
        WHERE id = ?
      `;
      params = [status, id];
    }

    await db.query(sql, params);

    res.json({ success: true });
  } catch (err) {
    console.error("updateStatus error:", err);
    res.status(500).json({ success: false });
  }
});

app.post("/ITApproveForm", async (req, res) => {
  try {
    const { id } = req.body;

    await db.query(
      `UPDATE it_requests
       SET status = 'APPROVED'
       WHERE id = ?`,
      [id],
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get("/getApproveFixForm", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        *,
        'FIX' AS form_type
      FROM it_fixrequest
      WHERE status IN ('APPROVED', 'IN_PROGRESS')
      ORDER BY request_date DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("FixForm ERROR:", err);
    res.json({ success: false, message: err.message });
  }
});

app.post("/ITFixForm", async (req, res) => {
  try {
    const {
      purpose,
      detail,
      tools,
      requester,
      department,
      request_date,
      required_date,
    } = req.body;

    const safe_required_date =
      required_date && required_date.trim() !== "" ? required_date : null;

    await db.query(
      `INSERT INTO it_fixrequest
      (purpose, detail, tools, requester, department, request_date, required_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        purpose,
        detail,
        tools,
        requester,
        department,
        request_date,
        safe_required_date,
      ],
    );

    const [users] = await db.query(
      `SELECT email
       FROM user
       WHERE role = 'Admin'
         AND email IS NOT NULL`,
    );

    const emailList = users.map((u) => u.email).join(",");
    const pendingUrl = "http://localhost:3000/Pending_Form";

    await transporter.sendMail({
      from: `"IT System" <chanasornhockey@gmail.com>`,
      to: emailList,
      subject: " มีคำขอ IT เพื่อแจ้งซ่อม",
      html: `
        <h3>มีคำขอ IT ใหม่</h3>
        <p><b>ผู้ร้องขอ:</b> ${requester}</p>
        <p><b>แผนก:</b> ${department}</p>
        <p><b>วัตถุประสงค์:</b> ${purpose}</p>
        <p><b>เหตุผล:</b> ${detail}</p>
        <p><b>วันที่ร้องขอ:</b> ${request_date}</p>
        <hr />
        <p>กรุณาคลิกที่ปุ่มด้านล่างเพื่อพิจารณาอนุมัติ</p>
        <a href="${pendingUrl}"
           style="
             display:inline-block;
             padding:10px 18px;
             background:#22c55e;
             color:#fff;
             text-decoration:none;
             border-radius:6px;
             font-weight:600;
           ">
          ไปที่หน้าForm
        </a>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("ITForm Error:", err);
    res.status(500).json({ success: false });
  }
});

app.get("/ITDashboard", async (req, res) => {
  try {
    let { status, startDate, endDate } = req.query;

    if (!["PENDING", "COMPLETE"].includes(status)) status = "PENDING";

    const dateField = status === "COMPLETE" ? "completed_at" : "created_at";

    let sql = `
      SELECT 
        DATE(${dateField}) AS date,
        COUNT(*) AS total
      FROM it_requests
      WHERE status = ?
        AND ${dateField} IS NOT NULL
    `;
    const params = [status];

    if (startDate && endDate) {
      sql += ` AND DATE(${dateField}) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    sql += `
      GROUP BY DATE(${dateField})
      ORDER BY DATE(${dateField})
    `;

    const [rows] = await db.query(sql, params);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.post("/markProblem/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { problem_detail, problem_by } = req.body;

    await db.query(
      `UPDATE it_requests
       SET 
         status = "PROBLEM",
         problem_detail = ?,
         problem_by = ?,
         problem_at = NOW()
       WHERE id = ?`,
      [problem_detail, problem_by, id],
    );

    res.json({ success: true, message: "Updated to PROBLEM" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.post("/savePerMissions", async (req, res) => {
  const { username, permissions } = req.body;
  try {
    const [[user]] = await db.query("SELECT id FROM user WHERE username = ?", [
      username,
    ]);

    const rows = [];

    for (const module in permissions) {
      for (const permission in permissions[module]) {
        if (
          typeof permission !== "string" ||
          permission === "undefined" ||
          permission.trim() === ""
        ) {
          continue;
        }
        rows.push([
          user.id,
          module,
          permission,
          permissions[module][permission] ? 1 : 0,
        ]);
      }
    }

    if (rows.length === 0) {
      return res.json({ success: true });
    }

    await db.query(
      `
      INSERT INTO user_permissions (user_id, module, permission, enabled)
      VALUES ?
      ON DUPLICATE KEY UPDATE enabled = VALUES(enabled)
      `,
      [rows],
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get("/userPermissions", async (req, res) => {
  try {
    const { username } = req.query;

    const [[user]] = await db.query(
      "SELECT id FROM user WHERE username = ? LIMIT 1",
      [username],
    );

    if (!user) return res.json([]);

    const [rows] = await db.query(
      `
      SELECT module, permission, enabled
      FROM user_permissions
      WHERE user_id = ?
      `,
      [user.id],
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/rejectITForm", async (req, res) => {
  const { id, reason, username } = req.body;

  try {
    const [result] = await db.query(
      `
      UPDATE it_requests
      SET 
        status = 'REJECTED',
        problem_detail = ?,
        problem_by = ?,
        problem_at = NOW()
      WHERE id = ?
      `,
      [reason, username, id],
    );

    if (result.affectedRows === 0) {
      return res.json({ success: false, message: "Form not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`),
);
