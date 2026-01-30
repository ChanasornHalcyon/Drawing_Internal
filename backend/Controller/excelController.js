const XLSX = require("xlsx");
const bcrypt = require("bcryptjs");
exports.importExcel = async (req, res) => {
  try {
    const db = req.db;

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetData.length === 0) {
      return res.json({ success: false, message: "Excel has no rows" });
    }

    for (const row of sheetData) {
      const username = row.username || "";
      const password = username.slice(-4) || "1234";
      const hashedPassword = await bcrypt.hash(password, 10);

      await db.query(
        `
        INSERT INTO user (
          username, firstname, lastname, nickname, email, role, 
          department, section, level, password
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

        ON DUPLICATE KEY UPDATE
          firstname = VALUES(firstname),
          lastname = VALUES(lastname),
          nickname = VALUES(nickname),
          email = VALUES(email),
          role = VALUES(role),
          department = VALUES(department),
          section = VALUES(section),
          level = VALUES(level)
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
          hashedPassword, // ← ใช้ bcrypt แล้ว
        ],
      );
    }

    res.json({ success: true, message: "Import successfully" });
  } catch (err) {
    console.error("Import Excel Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//// ล้างข้อมูลเก่าละแทนใหม่ทั้งหมด
// exports.importExcel = async (req, res) => {
//   try {
//     const db = req.db;

//     if (!req.file) {
//       return res.json({ success: false, message: "No file uploaded" });
//     }

//     const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     if (sheetData.length === 0) {
//       return res.json({ success: false, message: "Excel has no rows" });
//     }

//
//     await db.query("TRUNCATE TABLE user");

//     for (const row of sheetData) {
//       await db.query(
//         `
//         INSERT INTO user (
//           username, firstname, lastname, nickname, email, role,
//           department, section, level, password
//         )
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `,
//         [
//           row.username || "",
//           row.firstname || "",
//           row.lastname || "",
//           row.nickname || "",
//           row.email || "",
//           row.role || "",
//           row.department || "",
//           row.section || "",
//           row.level || "",
//           row.password || "1234", // default password
//         ]
//       );
//     }

//     res.json({ success: true, message: "Import successfully — replaced all data" });

//   } catch (err) {
//     console.error("Import Excel Error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

exports.exportUsers = async (req, res) => {
  try {
    const db = req.db;

    const [rows] = await db.query("SELECT * FROM user");

    const noPassword = rows.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });

    const XLSX = require("xlsx");
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(noPassword);

    XLSX.utils.book_append_sheet(wb, ws, "Users");

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
