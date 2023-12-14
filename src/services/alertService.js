const User = require('../models/user');
const { sendEmail } = require('./notificationService');
const { getPrices } = require('./coinGeckoService');

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

setInterval(checkPriceAlerts, 86400000); // Send email every day

module.exports = { checkPriceAlerts };
