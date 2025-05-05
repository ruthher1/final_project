const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (req, res) => {
  const { name, email, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.OUTLOOK_USER,
      pass: process.env.OUTLOOK_PASS,
    },
  });

  const mailOptions = {
    from: process.env.OUTLOOK_USER,
    to: process.env.MY_EMAIL,
    subject: `New message from ${name}`,
    text: `You received a new message from your website:
            Name: ${name}
Email: ${email}
Message:
${message}
    `,
    replyTo: email, // זה מה שגורם לכפתור "השב" ללכת למשתמש
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};

module.exports = { sendEmail };