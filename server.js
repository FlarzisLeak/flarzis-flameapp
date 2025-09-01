import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // serve index.html from public/

// POST /api/submit (this is what your form calls)
app.post("/api/submit", async (req, res) => {
  try {
    const { role, data, submittedAt, userAgent } = req.body;

    // --- Email setup ---
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "flarzisleaks@gmail.com",
        pass: "rtngyiyaiyvbfwxu", // ⚠️ your app password
      },
    });

    // format responses into text
    const formatted = Object.entries(data)
      .map(([q, a]) => `${q}: ${a || "—"}`)
      .join("\n");

    await transporter.sendMail({
      from: '"FLARZIS LEAKS Bot" <flarzisleaks@gmail.com>',
      to: "flarzisleaks@gmail.com", // where to send applications
      subject: `New ${role} application`,
      text: `📋 Role: ${role}\n\n${formatted}\n\n---\nSubmitted: ${submittedAt}\nUser Agent: ${userAgent}`,
    });

    console.log(`✅ Application email sent for role: ${role}`);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ Email send failed:", err);
    res.status(500).json({ error: "Email send failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
