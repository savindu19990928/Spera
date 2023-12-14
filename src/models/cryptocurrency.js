const mongoose = require('mongoose');

const cryptocurrencySchema = new mongoose.Schema({
  name: String,
  symbol: String,
  price: Number,
  usersWithAlerts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Cryptocurrency', cryptocurrencySchema);