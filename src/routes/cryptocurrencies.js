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
router.post('/favorites', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { name, symbol } = req.body;

    // Check if the cryptocurrency exists in the database
    let cryptocurrency = await Cryptocurrency.findOne({ name, symbol });

    // If not, fetch the price from CoinGecko and create a new entry
    if (!cryptocurrency) {
      const prices = await getPrices();
      const price = prices[name.toLowerCase()].usd;

      cryptocurrency = new Cryptocurrency({ name, symbol, price });
      await cryptocurrency.save();
    }

    // Add the cryptocurrency to the user's favorites
    user.favorites.push(cryptocurrency);
    await user.save();

    // Emit real-time update to connected clients
    emitPriceUpdate({ name, symbol, price: cryptocurrency.price });

    res.status(201).json({ message: 'Cryptocurrency added to favorites successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a cryptocurrency from the user's favorites
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

module.exports = router;