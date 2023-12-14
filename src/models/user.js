const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cryptocurrency' }],
});

module.exports = mongoose.model('User', userSchema);