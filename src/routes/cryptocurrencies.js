const express = require('express');
const router = express.Router();
const passport = require('passport');
const { emitPriceUpdate } = require('../services/socketioService');
const { getPrices } = require('../services/coinGeckoService');
const User = require('../models/user');
const Cryptocurrency = require('../models/cryptocurrency');

// Middleware to authenticate
const authenticate = passport.authenticate('jwt', { session: false });

// Get user's favorite cryptocurrencies
/**
 * @swagger
 * /cryptocurrencies/favorites:
 *   get:
 *     summary: Get user's favorite cryptocurrencies
 *     tags: [Cryptocurrencies]
 *     responses:
 *       200:
 *         description: Successful response with user's favorite cryptocurrencies
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal Server Error
 */
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const favorites = await User.findById(user._id).populate('favorites', 'name symbol price');

    res.json(favorites.favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a cryptocurrency to the user's favorites
/**
 * @swagger
 * /cryptocurrencies/favorites:
 *   post:
 *     summary: Add a cryptocurrency to user's favorites
 *     tags: [Cryptocurrencies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               symbol:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cryptocurrency added to favorites successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal Server Error
 */
router.post('/favorites', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { name, symbol } = req.body;

    // Check if the cryptocurrency exists in the database
    let cryptocurrency = await Cryptocurrency.findOne({ name, symbol });
    // If not, fetch the price from CoinGecko and create a new entry
    if (!cryptocurrency) {
      const prices = await getPrices();
      const price = prices[name.toLowerCase()].lkr;

      cryptocurrency = new Cryptocurrency({ name, symbol, price });
      await cryptocurrency.save();
    }

    // Add the cryptocurrency to the user's favorites
    user.favorites.push(cryptocurrency);
    await user.save();

    const cryptoData = await Cryptocurrency.findOne({ name, symbol });

    res.status(201).json({ message: 'Cryptocurrency added to favorites successfully', capturedID: cryptoData.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a cryptocurrency from the user's favorites
/**
 * @swagger
 * /cryptocurrencies/favorites/{id}:
 *   delete:
 *     summary: Remove a cryptocurrency from the user's favorites
 *     tags: 
 *       - Cryptocurrencies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cryptocurrency to be removed from favorites
 *     responses:
 *       200:
 *         description: Cryptocurrency removed from favorites successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Cryptocurrency not found in favorites
 *       500:
 *         description: Internal Server Error
 */

router.delete('/favorites/:id', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const cryptocurrencyId = req.params.id;

    // Find the cryptocurrency in the user's favorites
    const index = user.favorites.findIndex((fav) => fav.toString() === cryptocurrencyId);

    // If found, remove it
    if (index !== -1) {
      user.favorites.splice(index, 1);
      await user.save();

      res.json({ message: 'Cryptocurrency removed from favorites successfully' });
    } else {
      res.status(404).json({ message: 'Cryptocurrency not found in favorites' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /cryptocurrencies/alerts:
 *   post:
 *     summary: Set a price alert for a cryptocurrency
 *     tags: [Cryptocurrencies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: alert
 *         description: Alert details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             cryptocurrencyId:
 *               type: string
 *     responses:
 *       201:
 *         description: Price alert set successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Cryptocurrency not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/alerts', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = req.user;
    const { cryptocurrencyId } = req.body;

    // Check if the cryptocurrency exists
    const cryptocurrency = await Cryptocurrency.findById(cryptocurrencyId);
    if (!cryptocurrency) {
      return res.status(404).json({ message: 'Cryptocurrency not found' });
    }

    // Check if the user already has an alert for this cryptocurrency
    const existingAlert = user.alerts.find(alert => alert.cryptocurrency.equals(cryptocurrencyId));
    if (existingAlert) {
      return res.status(400).json({ message: 'Alert for this cryptocurrency already exists' });
    }

    // Add the alert to the user's alerts
    user.alerts.push({ cryptocurrency: cryptocurrencyId });
    await user.save();

    // Add the user to the cryptocurrency's usersWithAlerts
    cryptocurrency.usersWithAlerts.push(user._id);
    await cryptocurrency.save();

    res.status(201).json({ message: 'Price alert set successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /cryptocurrencies/alerts/{id}:
 *   delete:
 *     summary: Remove a price alert for a cryptocurrency
 *     tags: [Cryptocurrencies]
 *     security:
 *       - BearerAuth: []
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Price alert removed successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Cryptocurrency or alert not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/alerts/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = req.user;
    const alertId = req.params.id;

    // Find the alert in the user's alerts
    const alertIndex = user.alerts.findIndex(alert => alert._id.equals(alertId));

    // If found, remove it from the array
    if (alertIndex !== -1) {
      const cryptocurrencyId = user.alerts[alertIndex].cryptocurrency;

      // Remove the user from the cryptocurrency's usersWithAlerts
      await Cryptocurrency.findByIdAndUpdate(cryptocurrencyId, {
        $pull: { usersWithAlerts: user._id },
      });

      user.alerts.splice(alertIndex, 1);
      await user.save();

      res.json({ message: 'Price alert removed successfully' });
    } else {
      res.status(404).json({ message: 'Alert not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;