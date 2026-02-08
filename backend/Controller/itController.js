const transporter = require("../configs/mailer");

exports.createITForm = async (req, res) => {
  try {
    const db = req.db;
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
      SELECT department, email FROM user
      WHERE level >= 2 AND email IS NOT NULL
    `);

    const departmentMap = {};
    approvers.forEach((u) => {
      if (!departmentMap[u.department]) departmentMap[u.department] = [];
      departmentMap[u.department].push(u.email);
    });

    const pendingUrl = "http://localhost:3000/Pending_Form";

    for (const dept in departmentMap) {
      await transporter.sendMail({
        from: `"IT System" <itservice@halcyon.local>`,
        to: departmentMap[dept].join(","),
        subject: `มีคำขอ IT ใหม่ (${department})`,
        html: `
          <h3>มีคำขอ IT ใหม่</h3>
          <p><b>ผู้ร้องขอ:</b> ${requester}</p>
          <p><b>แผนก:</b> ${department}</p>
          <p><b>วัตถุประสงค์:</b> ${purpose}</p>
          <p><b>รายละเอียด:</b> ${detail}</p>
          <p><b>เหตุผล:</b> ${reason}</p>
          <hr/>
          <a href="${pendingUrl}"
             style="background:#22c55e;padding:10px 16px;color:#fff;border-radius:6px;text-decoration:none;">
             ไปที่หน้า Pending
          </a>
        `,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("createITForm ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// -----------------------

exports.createFixForm = async (req, res) => {
  try {
    const db = req.db;
    const {
      purpose,
      detail,
      tools,
      requester,
      department,
      request_date,
      required_date,
    } = req.body;

    const safeRequired = required_date?.trim() !== "" ? required_date : null;

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
        safeRequired,
      ],
    );

    const [admins] = await db.query(`
      SELECT department, email FROM user
      WHERE level >= 2 AND email IS NOT NULL
    `);

    const pendingUrl = "http://localhost:3000/Approve_Form";

    await transporter.sendMail({
      from: `"IT System" <itservice@halcyon.local>`,
      to: admins.map((a) => a.email).join(","),
      subject: `📌 คำขอแจ้งซ่อมใหม่จาก ${requester}`,

      html: `
  <div style="font-family: 'Segoe UI', Tahoma, sans-serif; background:#f7f7f7; padding:22px;">
    
    <div style="
      max-width:620px; 
      margin:0 auto; 
      background:white; 
      border-radius:14px; 
      padding:30px; 
      box-shadow:0 4px 12px rgba(0,0,0,0.08);
      border:1px solid #e5e7eb;
    ">

      <h2 style="color:#16a34a; margin-top:0; text-align:center; font-size:28px;">
         คำขอแจ้งซ่อมใหม่
      </h2>

      <p style="font-size:18px; color:#374151; line-height:1.8;">
        มีคำขอแจ้งซ่อมใหม่เข้ามาในระบบ โปรดตรวจสอบรายละเอียดด้านล่าง:
      </p>

      <div style="
        margin-top:22px; 
        padding:18px; 
        background:#f0fdf4; 
        border-radius:12px; 
        border-left:6px solid #22c55e;
      ">
        <p style="margin:10px 0; font-size:17px;"><b> ผู้ร้องขอ:</b> ${requester}</p>
        <p style="margin:10px 0; font-size:17px;"><b> แผนก:</b> ${department}</p>
        <p style="margin:10px 0; font-size:17px;"><b> วัตถุประสงค์:</b> ${purpose}</p>
        <p style="margin:10px 0; font-size:17px;"><b>รายละเอียด:</b> ${detail}</p>
      </div>

      <div style="text-align:center; margin-top:35px;">
        <a href="${pendingUrl}"
          style="
            background:#22c55e;
            padding:16px 26px;
            border-radius:10px;
            color:white;
            font-size:18px;
            text-decoration:none;
            display:inline-block;
            font-weight:600;
            box-shadow:0 2px 6px rgba(0,0,0,0.12);
          ">
           ไปที่หน้ารอดำเนินการ
        </a>
      </div>


    </div>
  </div>
  `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("FixForm ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// -----------------------

exports.getITForms = async (req, res) => {
  try {
    const db = req.db;
    const [rows] = await db.query(
      `SELECT * FROM it_requests ORDER BY created_at DESC`,
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("GetITForm ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// -----------------------

exports.getFixForms = async (req, res) => {
  try {
    const db = req.db;
    const [rows] = await db.query(
      `SELECT * FROM it_fixrequest ORDER BY created_at DESC`,
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getFixForms ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// -----------------------

exports.approveIT = async (req, res) => {
  try {
    const db = req.db;
    const { id } = req.body;

    await db.query(`UPDATE it_requests SET status='APPROVED' WHERE id=?`, [id]);

    res.json({ success: true });
  } catch (err) {
    console.error("approveIT ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// -----------------------

exports.getApproveITForms = async (req, res) => {
  try {
    const db = req.db;
    const [rows] = await db.query(`
      SELECT * FROM it_requests
      WHERE status IN ("APPROVED","IN_PROGRESS")
      ORDER BY created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("approveITList ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// -----------------------

exports.getApproveFixForm = async (req, res) => {
  try {
    const db = req.db;
    const [rows] = await db.query(`
      SELECT *, 'FIX' AS form_type
      FROM it_fixrequest
      WHERE status IN ("APPROVED","IN_PROGRESS")
      ORDER BY created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getApproveFixForm ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// -----------------------

exports.updateStatus = async (req, res) => {
  try {
    const db = req.db;
    const { id } = req.params;
    const { status, username, form_type, problem_detail } = req.body;

    const table = form_type === "FIX" ? "it_fixrequest" : "it_requests";

    let sql = "";
    let params = [];

    if (status === "IN_PROGRESS") {
      sql = `UPDATE ${table} SET status=?, started_by=?, started_at=NOW() WHERE id=?`;
      params = [status, username, id];
    } else if (status === "COMPLETE") {
      sql = `UPDATE ${table} SET status=?, completed_by=?, completed_at=NOW() WHERE id=?`;
      params = [status, username, id];
    } else if (status === "PROBLEM") {
      sql = `UPDATE ${table}
             SET status=?, problem_detail=?, problem_by=?, problem_at=NOW()
             WHERE id=?`;
      params = [status, problem_detail, username, id];
    } else {
      sql = `UPDATE ${table} SET status=? WHERE id=?`;
      params = [status, id];
    }

    await db.query(sql, params);
    res.json({ success: true });
  } catch (err) {
    console.error("updateStatus ERROR:", err);
    res.status(500).json({ success: false });
  }
};

exports.uploadPictures = async (req, res) => {
  try {
    const db = req.db;
    const { id } = req.params;
    const { username, completed_detail, form_type } = req.body;

    const table = form_type === "FIX" ? "it_fixrequest" : "it_requests";

    const imagePaths = (req.files || []).map((file) => {
      const relative = file.path.split("uploads").pop();
      return "/uploads" + relative.replace(/\\/g, "/");
    });

    await db.query(
      `UPDATE ${table}
       SET status='COMPLETE',
           completed_by=?,
           completed_at=NOW(),
           completed_detail=?,
           completed_images=?
       WHERE id=?`,
      [username, completed_detail, JSON.stringify(imagePaths), id],
    );

    res.json({ success: true, images: imagePaths });
  } catch (err) {
    console.error("uploadPictures ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// -----------------------

exports.rejectITForm = async (req, res) => {
  try {
    const db = req.db;
    const { id, reason, username } = req.body;

    const [result] = await db.query(
      `UPDATE it_requests
       SET status='REJECTED',
           problem_detail=?,
           problem_by=?,
           problem_at=NOW()
       WHERE id=?`,
      [reason, username, id],
    );

    if (!result.affectedRows)
      return res.json({ success: false, message: "Form not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("rejectITForm ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// -----------------------

exports.getCompleteITForms = async (req, res) => {
  try {
    const db = req.db;
    const [rows] = await db.query(`
      SELECT * FROM it_requests
      WHERE status='COMPLETE'
      ORDER BY completed_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getComplete ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// -----------------------

exports.getCompleteFixForms = async (req, res) => {
  try {
    const db = req.db;
    const [rows] = await db.query(`
      SELECT * FROM it_fixrequest
      WHERE status='COMPLETE'
      ORDER BY completed_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getCompleteFix ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// -----------------------

exports.getProblemForms = async (req, res) => {
  try {
    const db = req.db;
    const [rows] = await db.query(
      `
      SELECT *
      FROM it_requests
      WHERE status = 'PROBLEM'
      ORDER BY problem_at DESC
      `,
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getProblemForm ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// -----------------------

exports.getProblemFixForms = async (req, res) => {
  try {
    const db = req.db;
    const [rows] = await db.query(
      `
      SELECT *
      FROM it_fixrequest
      WHERE status = 'PROBLEM'
      ORDER BY problem_at DESC
      `,
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getProblemFixForm ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// -----------------------

exports.dashboard = async (req, res) => {
  try {
    const db = req.db;
    let { status, startDate, endDate } = req.query;

    if (!["COMPLETE", "PROBLEM"].includes(status)) {
      status = "COMPLETE";
    }

    const dateField = status === "COMPLETE" ? "completed_at" : "problem_at";

    let sql = `
      SELECT DATE(${dateField}) AS date, COUNT(*) AS total
      FROM it_requests
      WHERE status = ? 
        AND ${dateField} IS NOT NULL
    `;

    const params = [status];

    if (startDate && endDate) {
      sql += ` AND DATE(${dateField}) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    sql += ` GROUP BY DATE(${dateField}) ORDER BY DATE(${dateField})`;

    const [rows] = await db.query(sql, params);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("dashboard ERROR:", err);
    res.status(500).json({ success: false });
  }
};
