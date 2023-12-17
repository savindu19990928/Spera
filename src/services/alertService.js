const User = require('../models/user');
const { sendEmail } = require('./notificationService');
const { getPrices } = require('./coinGeckoService');
const dotenv = require('dotenv');

dotenv.config();

async function checkPriceAlerts() {
  try {
    const users = await User.find().populate('alerts.cryptocurrency');

    users.forEach(async (user) => {
      user.alerts.forEach(async (alert) => {
        const cryptocurrency = alert.cryptocurrency;
        const prices = await getPrices();
        const currentPrice = prices[cryptocurrency.name.toLowerCase()].lkr;

        // Trigger email alert
        const subject = `Price alert for ${cryptocurrency.name}`;
        const message = `Current price is ${currentPrice}`;
        await sendEmail(user.email, subject, message);
      });
    });
  } catch (error) {
    console.error('Error checking price alerts:', error);
  }
}

setInterval(checkPriceAlerts, process.env.ALERT_PERIOD);

module.exports = { checkPriceAlerts };
