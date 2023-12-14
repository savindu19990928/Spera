const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dotenv = require('dotenv');
const { setupSocketIO } = require('./services/socketioService');
const authRoutes = require('./routes/auth');
const cryptocurrenciesRoutes = require('./routes/cryptocurrencies');
const User = require('./models/user');

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Passport local strategy
passport.use(new LocalStrategy(User.authenticate()));

// Routes
app.use('/auth', authRoutes);
app.use('/cryptocurrencies', cryptocurrenciesRoutes);

// Start Socket.IO
setupSocketIO(server);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});