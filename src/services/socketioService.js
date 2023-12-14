const socketIO = require('socket.io');
const { getPrices } = require('./coinGeckoService');

let io;

// Setup Socket.IO
const setupSocketIO = (server) => {
  io = socketIO(server);

  // Periodically (Every 5 seconds) emit cryptocurrency price updates
  setInterval(async () => {
    try {
      const prices = await getPrices();
      emitPriceUpdate(prices);
    } catch (error) {}
  }, 5000);
};

// Emit a price update to all connected clients
const emitPriceUpdate = (data) => {
  if (io) {
    io.emit('price_update', data);
  }
};

module.exports = { setupSocketIO, emitPriceUpdate };
