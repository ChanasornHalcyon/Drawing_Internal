const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.halcyon.local",
  port: 587,
  secure: false,
  auth: {
    user: "itservice@halcyon.local",
    pass: "H@lcyon2026",
  },
  tls: { rejectUnauthorized: false },
});

module.exports = transporter;
