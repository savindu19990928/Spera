const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config()

// Set up OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

// Get an access token
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// Create a nodemailer transporter with OAuth2
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.E_MAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: oauth2Client.getAccessToken()
  },
});

async function sendEmail(to, subject, message) {
  const mailOptions = {
    from: 'devriousteam@gmail.com',
    to : to,
    subject : subject,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = { sendEmail };
