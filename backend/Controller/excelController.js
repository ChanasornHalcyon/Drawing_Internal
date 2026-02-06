const XLSX = require("xlsx");
const bcrypt = require("bcryptjs");

// exports.importExcel = async (req, res) => {
//   try {
//     const db = req.db;

//     const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     if (sheetData.length === 0) {
//       return res.json({ success: false, message: "Excel has no rows" });
//     }

//     for (const row of sheetData) {
//       const username = row.username || "";
//       const rawPassword = row.password
//         ? String(row.password)
//         : String(username).slice(-4);

//       const hashedPassword = await bcrypt.hash(rawPassword, 10);

//       await db.query(
//         `
//         INSERT INTO user (
//           username, firstname, lastname, nickname, email, role,
//           department, section, level, password
//         )
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

//         ON DUPLICATE KEY UPDATE
//           firstname = VALUES(firstname),
//           lastname = VALUES(lastname),
//           nickname = VALUES(nickname),
//           email = VALUES(email),
//           role = VALUES(role),
//           department = VALUES(department),
//           section = VALUES(section),
//           level = VALUES(level)
//         `,
//         [
//           username,
//           row.firstname || "",
//           row.lastname || "",
//           row.nickname || "",
//           row.email || "",
//           row.role || "",
//           row.department || "",
//           row.section || "",
//           row.level || "",
//           hashedPassword,
//         ]
//       );
//     }

//     res.json({ success: true, message: "Import successfully" });

//   } catch (err) {
//     console.error("Import Excel Error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

/// ลบอันเก่าละแอดใหม่ทั้งหมด

exports.importExcel = async (req, res) => {
  try {
    const db = req.db;

    if (!req.file) {
      return res.json({ success: false, message: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const row of sheetData) {
      const username = row.username || "";

      let hashedPassword;
      if (row.password) {
        hashedPassword = row.password;
      } else {
        const rawPassword = String(username).slice(-4);
        hashedPassword = await bcrypt.hash(rawPassword, 10);
      }

      const [result] = await db.query(
        `
        INSERT INTO user (
          username, firstname, lastname, nickname, email, role,
          department, section, level, password
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          firstname   = VALUES(firstname),
          lastname    = VALUES(lastname),
          nickname    = VALUES(nickname),
          email       = VALUES(email),
          role        = VALUES(role),
          department  = VALUES(department),
          section     = VALUES(section),
          level       = VALUES(level),
          password    = VALUES(password)
        `,
        [
          username,
          row.firstname || "",
          row.lastname || "",
          row.nickname || "",
          row.email || "",
          row.role || "",
          row.department || "",
          row.section || "",
          row.level || "",
          hashedPassword,
        ]
      );

      let userId = result.insertId;
      if (!userId) {
        const [u] = await db.query(
          `SELECT id FROM user WHERE username = ? LIMIT 1`,
          [username]
        );
        if (u.length > 0) userId = u[0].id;
      }

      if (!userId) continue;

      await db.query(
        `
        INSERT IGNORE INTO user_permissions (user_id, module, permission, enabled)
        VALUES
          (?, 'IT', 'enabled', 1),
          (?, 'IT', 'ฟอร์มแจ้งซ่อม', 1)
        `,
        [userId, userId]
      );
    }

    res.json({
      success: true,
      message: "Import complete — user fully updated and permissions ensured."
    });

  } catch (err) {
    console.error("Import Excel Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.exportUsers = async (req, res) => {
  try {
    const db = req.db;
    const [rows] = await db.query("SELECT * FROM user");
    const selectedFields = rows.map((user) => ({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      nickname: user.nickname,
      email: user.email,
      role: user.role,
      department: user.department,
      section: user.section,
      level: user.level,
      password: user.password,
    }));

    const XLSX = require("xlsx");
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(selectedFields);

    XLSX.utils.book_append_sheet(wb, ws, "user");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users_export.xlsx",
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.send(buffer);
  } catch (err) {
    console.error("Export Excel Error:", err);
    res.status(500).json({ success: false });
  }
};
