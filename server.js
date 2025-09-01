// Node server (same as before) — serves static site and relays to Gmail.
const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json({limit:'1mb'}));
app.use(express.static(path.join(__dirname, 'public')));

const TO = process.env.TO_EMAIL || 'flarzs.co@gmail.com';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
});

function toHtml(role, submittedAt, userAgent, data){
  const rows = Object.entries(data).map(([k,v])=>`
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#ff6a00;font-weight:600">${k}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap">${(v||'').toString().replace(/[<>]/g, s=>({'<':'&lt;','>':'&gt;'}[s]))}</td>
    </tr>`).join('');
  return `
  <div style="font-family:Inter,Segoe UI,Arial,sans-serif">
    <h2 style="margin:0 0 8px;color:#111">FLARZIS LEAKS — Application</h2>
    <div style="margin:0 0 12px;color:#666">Role: <b>${role.toUpperCase()}</b></div>
    <div style="margin:0 0 12px;color:#666">Submitted: ${submittedAt}<br/>UA: ${userAgent}</div>
    <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;max-width:900px">${rows}</table>
  </div>`;
}

app.post('/api/submit', async (req,res)=>{
  try{
    const { role, data, submittedAt, userAgent } = req.body || {};
    if(!role || !data) return res.status(400).send('Bad body');
    const text = Object.entries(data).map(([k,v])=>`${k}\n${v}\n`).join('\n----------------\n');
    const html = toHtml(role, submittedAt, userAgent, data);
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: TO,
      subject: `[APPLICATION] ${String(role).toUpperCase()}`,
      text: `Role: ${role}\nSubmitted: ${submittedAt}\nUA: ${userAgent}\n\n${text}`,
      html
    });
    res.json({ok:true});
  }catch(err){
    console.error(err);
    res.status(500).send('Send failed');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Flarzis Applications running at http://localhost:'+PORT));
