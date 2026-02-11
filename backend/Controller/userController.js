const bcrypt = require("bcryptjs");

exports.verifyUser = async (req, res) => {
  try {
    const db = req.db;
    const { username, password } = req.body;

    const [rows] = await db.query(
      `SELECT id, username, role,company, department, firstname, lastname, password
       FROM users
       WHERE username = ?`,
      [username],
    );

    if (rows.length === 0) {
      return res.json({ success: false });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false });
    }
    delete user.password;

    res.json({ success: true, user });
  } catch (err) {
    console.error("verifyUser error:", err);
    res.status(500).json({ success: false });
  }
};

exports.addUser = async (req, res) => {
  try {
    const db = req.db;
    const {
      email,
      nickname,
      firstname,
      lastname,
      username,
      password,
      role,
      department,
      company,
      level,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      INSERT INTO users
      (email, nickname, firstname, lastname, username, password, role, department, company, level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        email,
        nickname,
        firstname,
        lastname,
        username,
        hashedPassword,
        role,
        department,
        company,
        level,
      ],
    );

    const userId = result.insertId;

    const defaultPermissions = [
      [userId, "IT", "enabled", 1],
      [userId, "IT", "ฟอร์มแจ้งซ่อม", 1],
    ];

    await db.query(
      `
      INSERT INTO user_permissions (user_id, module, permission, enabled)
      VALUES ?
      `,
      [defaultPermissions],
    );

    res.json({ success: true, message: "User added with default permissions" });
  } catch (err) {
    console.error("Add user error:", err);
    res.status(500).json({ success: false });
  }
};

exports.editUser = async (req, res) => {
  try {
    const db = req.db;
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
      company,
      level,
    } = req.body;

    let sql = `
      UPDATE users
      SET email=?, nickname=?, firstname=?, lastname=?, username=?,
          role=?, department=?, company=?, level=?
    `;
    const params = [
      email,
      nickname,
      firstname,
      lastname,
      username,
      role,
      department,
      company,
      level,
    ];

    if (password && password.trim() !== "") {
      sql += `, password=?`;
      params.push(password);
    }

    sql += ` WHERE id=?`;
    params.push(id);

    await db.query(sql, params);

    res.json({ success: true });
  } catch (err) {
    console.error("Edit user error:", err);
    res.status(500).json({ success: false });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const db = req.db;
    const { id, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query("UPDATE users SET password=? WHERE id=?", [
      hashedPassword,
      id,
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ success: false });
  }
};

exports.getUser = async (req, res) => {
  try {
    const db = req.db;
    const [rows] = await db.query(`
      SELECT id, email, username, role, nickname, firstname, lastname, department, company, level
      FROM users
    `);
    res.json({ success: true, users: rows });
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ success: false });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const db = req.db;
    const { keyword } = req.query;
    const search = `%${keyword}%`;

    const [rows] = await db.query(
      `
      SELECT id, username, email, firstname, lastname, nickname, role, department, company, level
      FROM users
      WHERE username LIKE ? OR email LIKE ? OR firstname LIKE ? OR lastname LIKE ? OR nickname LIKE ?
      ORDER BY id DESC
      `,
      [search, search, search, search, search],
    );

    res.json({ success: true, users: rows });
  } catch (err) {
    console.error("Search user error:", err);
    res.status(500).json({ success: false });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const db = req.db;
    const { id } = req.params;

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ success: true });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ success: false });
  }
};

exports.userPermissions = async (req, res) => {
  try {
    const db = req.db;
    const { username } = req.query;

    const [[user]] = await db.query(
      "SELECT id FROM users WHERE username = ? LIMIT 1",
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
    console.error("getUserPermissions ERROR:", err);
    res.status(500).json({ success: false });
  }
};

exports.savePermissions = async (req, res) => {
  try {
    const db = req.db;
    const { username, permissions } = req.body;

    const [[user]] = await db.query(
      "SELECT id FROM users WHERE username=? LIMIT 1",
      [username],
    );

    if (!user) return res.json({ success: false, message: "User not found" });

    const rows = [];

    for (const module in permissions) {
      for (const perm in permissions[module]) {
        rows.push([user.id, module, perm, permissions[module][perm] ? 1 : 0]);
      }
    }

    if (rows.length === 0) return res.json({ success: true });

    await db.query(
      `
      INSERT INTO user_permissions (user_id, module, permission, enabled)
      VALUES ?
      ON DUPLICATE KEY UPDATE 
          enabled = VALUES(enabled)
      `,
      [rows],
    );

    res.json({ success: true });
  } catch (err) {
    console.error("savePermission ERROR:", err);
    res.status(500).json({ success: false });
  }
};
