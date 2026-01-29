const XLSX = require("xlsx");

exports.importExcel = async (req, res) => {
  try {
    const db = req.db; 

    if (!req.file) {
      return res.json({ success: false, message: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetData.length === 0) {
      return res.json({ success: false, message: "Excel has no rows" });
    }

    for (const row of sheetData) {
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
          row.username || "",
          row.firstname || "",
          row.lastname || "",
          row.nickname || "",
          row.email || "",
          row.role || "",
          row.department || "",
          row.section || "",
          row.level || "",
          row.password || "1234",
        ],
      );
    }

    res.json({ success: true, message: "Import successfully" });
  } catch (err) {
    console.error("Import Excel Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
