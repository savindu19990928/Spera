const axios = require('axios');

const coinGeckoAPI = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

// Example: Fetch cryptocurrency prices from CoinGecko
const getPrices = async () => {
  try {
    const response = await coinGeckoAPI.get('/simple/price', {
      params: {
        ids: 'bitcoin,ethereum,ripple,tether', // Replace with your desired cryptocurrency IDs
        vs_currencies: 'lkr', // Replace with LKR
      },
    });

    return response.data;
  } catch (error) {
    // console.error('Error fetching cryptocurrency prices:', error.message);
    throw error;
  }
};

module.exports = { getPrices };