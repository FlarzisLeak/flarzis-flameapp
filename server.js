import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (index.html etc.)
app.use(express.static("public"));

// Handle form submission
app.post("/api/submit", async (req, res) => {
  try {
    const { role, answers } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "flarzs.co@gmail.com",   // your Gmail
        pass: "rtngyiyaiyvbfwxu"       // new Gmail App Password
      }
    });

    const mailOptions = {
      from: "flarzs.co@gmail.com",
      to: "flarzs.co@gmail.com",
      subject: `New Application for ${role}`,
      text: `Role: ${role}\n\nAnswers:\n${answers.map((a, i) => `${i+1}. ${a}`).join("\n")}`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Application submitted successfully!" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
