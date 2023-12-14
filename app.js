const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const dotenv = require('dotenv');
const { setupSocketIO } = require('./src/services/socketioService');
const authRoutes = require('./src/routes/auth');
const cryptocurrenciesRoutes = require('./src/routes/cryptocurrencies');
const User = require('./src/models/user');
const swaggerDoc = require('./src/swagger');
const { checkPriceAlerts } = require('./src/services/alertService');

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Passport JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

passport.use(
  new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.userId)
      .then(user => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => {
        return done(err, false);
      });
  })
);

// Routes
app.use('/auth', authRoutes);
app.use('/cryptocurrencies', cryptocurrenciesRoutes);
app.use('/', swaggerDoc);

// Price alerts checker
checkPriceAlerts();

// Start Socket.IO
setupSocketIO(server);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});