const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const mysql = require("mysql2/promise");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "backend", "uploads")));
let db;

async function initMySQL() {
  try {
    db = await mysql.createPool({
      host: "localhost",
      user: "root",
      password: "khemnak1530",
      database: "halcyon_internal",
      waitForConnections: true,
      connectionLimit: 10,
    });

    console.log("MySQL Pool Connected ✔");
    return db;
  } catch (err) {
    console.error(" MySQL Error:", err);
    process.exit(1);
  }
}
app.use((req, res, next) => {
  if (!db) {
    return res.status(503).json({
      success: false,
      message: "Database not connected yet",
    });
  }
  req.db = db;
  next();
});

app.use("/", require("./routes/user.routes"));
app.use("/", require("./routes/drawing.routes"));


app.get("/", (req, res) => {
  res.send("Halcyon Internal API running...");
});

(async () => {
  await initMySQL();
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });

})();
