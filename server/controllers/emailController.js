const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmailFromClient = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
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
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};

const sendEmailToClient = async (req, res) => {


  const { name, manager, email } = req.body;
  if (!name || !manager||! email) {
    return res.status(400).json({ message: 'All fields are required' });
  }
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
    to: email,
    subject: `New message from Task Track`,
    text: `Hello ${name},You have successfully registered for the Task Track system by ${manager}.
You can log in with:
Username: Your ID number,
Password: Your phone number.
You can change your password by going to the security settings in the system.
Good luck!
The website team.`,
    replyTo:'', 
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
}



module.exports = { sendEmailFromClient,sendEmailToClient };