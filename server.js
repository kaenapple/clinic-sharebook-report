const path = require("path");
const crypto = require("crypto");
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }
});

const port = Number(process.env.PORT || 3000);
const appPassword = process.env.APP_PASSWORD || "1234";
const authToken = crypto
  .createHmac("sha256", appPassword)
  .update("clinic-sharebook-report")
  .digest("hex");

app.use(express.urlencoded({ extended: false }));

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key, value]) => key && value)
      .map(([key, value]) => [key, decodeURIComponent(value)])
  );
}

function isAuthenticated(req) {
  const cookies = parseCookies(req.headers.cookie);
  return cookies.sharebook_auth === authToken;
}

app.get("/login", (_req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.post("/login", (req, res) => {
  if (req.body.password !== appPassword) {
    return res.redirect("/login?error=1");
  }

  res.cookie("sharebook_auth", authToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 1000 * 60 * 60 * 12
  });
  res.redirect("/");
});

app.post("/logout", (_req, res) => {
  res.clearCookie("sharebook_auth");
  res.redirect("/login");
});

app.use((req, res, next) => {
  if (req.path === "/login") return next();
  if (isAuthenticated(req)) return next();
  res.redirect("/login");
});

app.use(express.static(__dirname));

app.post("/api/send-report", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDFが添付されていません。" });
    }

    const required = [
      "REPORT_TO_EMAIL",
      "REPORT_FROM_EMAIL",
      "SMTP_HOST",
      "SMTP_USER",
      "SMTP_PASS"
    ];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      return res.status(500).json({
        error: `メール設定が不足しています: ${missing.join(", ")}`
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const patientName = req.body.patientName || "シェアブック";
    const reportDate = req.body.reportDate || new Date().toISOString().slice(0, 10);

    await transporter.sendMail({
      from: process.env.REPORT_FROM_EMAIL,
      to: process.env.REPORT_TO_EMAIL.split(",").map((email) => email.trim()).filter(Boolean),
      subject: `報告書 ${patientName} ${reportDate}`,
      text: [
        "共有ウェブページから報告書PDFが送信されました。",
        "",
        `報告書: ${patientName}`,
        `報告日: ${reportDate}`
      ].join("\n"),
      attachments: [
        {
          filename: req.file.originalname || "report.pdf",
          content: req.file.buffer,
          contentType: "application/pdf"
        }
      ]
    });

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message || "送信に失敗しました。" });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Clinic report page: http://localhost:${port}`);
});
