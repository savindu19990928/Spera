const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cryptocurrency' }],
  alerts: [
    {
      cryptocurrency: { type: mongoose.Schema.Types.ObjectId, ref: 'Cryptocurrency' }
    },
  ],
});

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to validate a password
userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;