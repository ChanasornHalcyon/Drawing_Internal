const fs = require("fs");
const path = require("path");

exports.pushData = async (req, res) => {
  try {
    const db = req.db;
    const body = req.body;
    let fileUrl = null;

    if (req.file) {
      const folder = body.customerName.trim().replace(/\s+/g, "_");
      fileUrl = `/uploads/${folder}/${req.file.originalname}`;
    }

    const sql = `
      INSERT INTO drawing_records 
      (customer_name, date, drawing_no, rev, customer_part_no, description,
       material_main, price, cost, coolant_hole, flute, coating, file_url,
       A1, A2, A3, D1, D2, D3, CL1, CL2, TL, type)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    const [result] = await db.query(sql, [
      body.customerName,
      body.date,
      body.drawingNo,
      body.rev,
      body.customerPart,
      body.description,
      body.materialMain,
      body.price,
      body.cost,
      body.CoolantHole,
      body.Flute,
      body.Cloating,
      fileUrl,
      body.A1,
      body.A2,
      body.A3,
      body.D1,
      body.D2,
      body.D3,
      body.CL1,
      body.CL2,
      body.TL,
      body.type,
    ]);

    const newId = result.insertId;

    const actionDetail = JSON.stringify(body);
    await db.query(
      `INSERT INTO drawing_logs (drawing_id, action_type, action_by, action_detail)
       VALUES (?, 'ADD', ?, ?)`,
      [newId, body.username, actionDetail],
    );

    res.json({ success: true, drawing_id: newId });
  } catch (err) {
    console.error("pushData Error:", err);
    res.status(500).json({ success: false });
  }
};


exports.checkDrawingNo = async (req, res) => {
  try {
    const db = req.db;
    const { drawingNo } = req.query;

    const [rows] = await db.query(
      "SELECT COUNT(*) AS count FROM drawing_records WHERE drawing_no = ?",
      [drawingNo],
    );

    res.json({ exists: rows[0].count > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ exists: false });
  }
};

exports.getAllData = async (req, res) => {
  try {
    const db = req.db;
    const [rows] = await db.query(
      "SELECT * FROM drawing_records ORDER BY id DESC",
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getAllData Error:", err);
    res.status(500).json({ success: false });
  }
};

exports.searchDrawing = async (req, res) => {
  try {
    const db = req.db;
    const q = req.body;

    let sql = "SELECT * FROM drawing_records WHERE 1=1";
    const params = [];

    const add = (field, key) => {
      if (q[key]) {
        sql += ` AND LOWER(${field}) LIKE LOWER(?)`;
        params.push(`%${q[key]}%`);
      }
    };

    add("customer_name", "customerName");
    add("drawing_no", "drawingNo");
    add("rev", "rev");
    add("customer_part_no", "customerPart");
    add("description", "description");
    add("material_main", "materialMain");
    add("pcd_grade", "pcdGrade");
    add("coolant_hole", "coolantHole");
    add("flute", "flute");
    add("coating", "cloating");
    add("shank_material", "shankMaterial");
    add("shank_shape", "shankShape");
    add("type", "type");

    ["A1", "A2", "A3", "D1", "D2", "D3", "CL1", "CL2", "TL"].forEach((f) =>
      add(f, f),
    );

    if (q.startDate && q.endDate) {
      sql += " AND DATE(`date`) BETWEEN ? AND ?";
      params.push(q.startDate, q.endDate);
    }

    sql += " ORDER BY id ASC";

    const [rows] = await db.query(sql, params);

    if (!rows.length) {
      return res.json({ success: false, message: "ไม่พบข้อมูลตามเงื่อนไข" });
    }

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false });
  }
};

exports.updateDrawing = async (req, res) => {
  try {
    const db = req.db;
    const id = req.params.id;
    const body = req.body;
    const file = req.file;

    const [oldRows] = await db.query(
      "SELECT * FROM drawing_records WHERE id=?",
      [id],
    );
    if (!oldRows.length) return res.status(404).json({ success: false });

    const old = oldRows[0];

    await db.query(
      `INSERT INTO drawing_history (drawing_id, modified_by, data)
       VALUES (?, ?, ?)`,
      [id, body.updated_by || "unknown", JSON.stringify(old)],
    );

    let fileUrl = old.file_url;
    if (file) {
      const folder = body.customer_name.trim().replace(/\s+/g, "_");
      const dest = path.join("uploads", folder, file.originalname);
      fs.renameSync(file.path, dest);
      fileUrl = `/uploads/${folder}/${file.originalname}`;
    }

    await db.query(
      `UPDATE drawing_records
       SET customer_name=?, date=?, drawing_no=?, rev=?, description=?, 
           material_main=?, price=?, cost=?, coolant_hole=?, flute=?, coating=?,
           type=?, A1=?, A2=?, A3=?, D1=?, D2=?, D3=?, CL1=?, CL2=?, TL=?, file_url=?
       WHERE id=?`,
      [
        body.customer_name,
        body.date,
        body.drawing_no,
        body.rev,
        body.description,
        body.material_main,
        body.price,
        body.cost,
        body.coolant_hole,
        body.flute,
        body.coating,
        body.type,
        body.A1,
        body.A2,
        body.A3,
        body.D1,
        body.D2,
        body.D3,
        body.CL1,
        body.CL2,
        body.TL,
        fileUrl,
        id,
      ],
    );

    await db.query(
      `INSERT INTO drawing_logs (drawing_id, action_type, action_by, action_detail)
       VALUES (?, 'EDIT', ?, ?)`,
      [id, body.updated_by || "unknown", JSON.stringify(old)],
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

exports.getDrawingLogs = async (req, res) => {
  try {
    const db = req.db;
    const [rows] = await db.query(
      `SELECT * FROM drawing_logs ORDER BY created_at DESC`,
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

exports.getDrawingHistory = async (req, res) => {
  try {
    const db = req.db;
    const id = req.params.id;

    const [current] = await db.query(
      "SELECT *, NOW() as modified_at FROM drawing_records WHERE id=?",
      [id],
    );
    const [history] = await db.query(
      "SELECT * FROM drawing_history WHERE drawing_id=? ORDER BY modified_at DESC",
      [id],
    );

    const result = [];
    if (current.length) {
      result.push({
        id: 0,
        modified_at: current[0].modified_at,
        modified_by: current[0].updated_by || "Current Version",
        data: JSON.stringify(current[0]),
      });
    }

    result.push(...history);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ success: false });
  }
};

exports.deleteDrawingHistory = async (req, res) => {
  try {
    const db = req.db;
    const historyId = Number(req.params.id);
    const deletedBy = req.query.deleted_by || "unknown";

    // Delete all (historyId = 0)
    if (historyId === 0) {
      const drawingId = req.query.drawingId;

      await db.query("DELETE FROM drawing_history WHERE drawing_id=?", [
        drawingId,
      ]);
      await db.query("DELETE FROM drawing_records WHERE id=?", [drawingId]);

      await db.query(
        `INSERT INTO drawing_logs (drawing_id, action_type, action_by, action_detail)
         VALUES (?, 'DELETE', ?, ?)`,
        [
          drawingId,
          deletedBy,
          JSON.stringify({ reason: "Delete all records" }),
        ],
      );

      return res.json({ success: true });
    }

    const [rows] = await db.query("SELECT * FROM drawing_history WHERE id=?", [
      historyId,
    ]);

    if (!rows.length) return res.status(404).json({ success: false });

    const row = rows[0];
    const drawingId = row.drawing_id;

    await db.query(
      `INSERT INTO drawing_logs (drawing_id, action_type, action_by, action_detail)
       VALUES (?, 'DELETE', ?, ?)`,
      [drawingId, deletedBy, row.data],
    );

    await db.query("DELETE FROM drawing_history WHERE id=?", [historyId]);

    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false });
  }
};
