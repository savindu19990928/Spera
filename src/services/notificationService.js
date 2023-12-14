const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Set up OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  '727633019198-akfbve1b5trjm023ugbs3mth9iq2g9mr.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground'
);

// Get an access token
oauth2Client.setCredentials({
  refresh_token: '1//04B-Y01CyF9JcCgYIARAAGAQSNwF-L9IrJPC37HZQm4eDP5r3vPZixqbHOA-Yrip4gukzsIaPRvMJfaoWRpT1J-li5VYWc0-zGJg',
});

// Create a nodemailer transporter with OAuth2
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'devriousteam@gmail.com',
    clientId: '727633019198-akfbve1b5trjm023ugbs3mth9iq2g9mr.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04B-Y01CyF9JcCgYIARAAGAQSNwF-L9IrJPC37HZQm4eDP5r3vPZixqbHOA-Yrip4gukzsIaPRvMJfaoWRpT1J-li5VYWc0-zGJg',
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
