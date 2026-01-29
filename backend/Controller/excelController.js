const xlsx = require("xlsx");

exports.uploadExcelFile = async (req, res) => {
  try {
    if (!req.file)
      return res.json({ success: false, message: "No file uploaded" });

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const db = req.db;

    for (const r of rows) {
      await db.query(
        `INSERT INTO excel_data (col1, col2, col3) VALUES (?, ?, ?)`,
        [r.col1, r.col2, r.col3],
      );
    }

    res.json({ success: true, rowsUploaded: rows.length });
  } catch (err) {
    console.error("uploadExcelFile ERROR:", err);
    res.status(500).json({ success: false });
  }
};

exports.getExcelData = async (_, res) => {
  try {
    const db = getDB();
    const [rows] = await db.query(`SELECT * FROM excel_data ORDER BY id DESC`);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getExcelData ERROR:", err);
    res.status(500).json({ success: false });
  }
};
