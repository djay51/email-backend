// index.js
// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const requireApiKey = (req, res, next) => {
//   const key = req.header('x-api-key') || req.query.api_key;
//   if (!key || key !== process.env.API_KEY) return res.status(401).json({ error: 'Unauthorized' });
//   next();
// };

// app.post('/send-email', requireApiKey, async (req, res) => {
//   console.log('📨 Requête reçue :', req.body);
//   const { to, subject, text } = req.body;
//   if (!to || !subject || !text) return res.status(400).json({ error: 'Missing to/subject/text' });

//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
//     });

//     await transporter.sendMail({
//       from: `"SportReservation" <${process.env.EMAIL_USER}>`,
//       to, subject, text
//     });

//     console.log('✅ Mail envoyé côté serveur');
//     res.status(200).json({ ok: true, message: 'Email envoyé' });
//   } catch (err) {
//     console.error('❌ Erreur Nodemailer:', err);
//     res.status(500).json({ error: err.toString() });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Listening on ${PORT}`));



// 1️⃣ Charger les variables d'environnement
require('dotenv').config();

// 2️⃣ Importer Express et Nodemailer
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

// 3️⃣ Middleware pour parser le JSON
app.use(express.json());

// 4️⃣ Configurer le transporteur Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // depuis .env
    pass: process.env.EMAIL_PASS  // depuis .env
  },
  tls: {
    rejectUnauthorized: false // ✅ ignore les certificats non valides
  }
});

// 5️⃣ Route POST pour envoyer un mail
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
    res.json({ status: 'ok', message: 'Email envoyé avec succès !' });
  } catch (e) {
    console.error('Erreur Nodemailer:', e);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
  }
});

// 6️⃣ Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur Node.js démarré sur le port ${PORT}`);
});
