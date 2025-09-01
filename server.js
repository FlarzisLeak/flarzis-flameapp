const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// Route: Home (serves index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route: Handle form submission
app.post("/submit", async (req, res) => {
  const formData = req.body;

  try {
    // Transporter setup (replace with your Gmail + App Password)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "flarzs.co@gmail.com",
        pass: "nzlt jvhn kipz psum" // 👈 replace this
      },
    });

    const mailOptions = {
      from: "flarzs.co@gmail.com",
      to: "flarzs.co@gmail.com",
      subject: "New Application Submission",
      text: JSON.stringify(formData, null, 2),
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Application submitted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
