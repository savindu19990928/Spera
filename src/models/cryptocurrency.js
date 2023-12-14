const mongoose = require('mongoose');

const cryptocurrencySchema = new mongoose.Schema({
  name: String,
  symbol: String,
  price: Number
});

module.exports = mongoose.model('Cryptocurrency', cryptocurrencySchema);