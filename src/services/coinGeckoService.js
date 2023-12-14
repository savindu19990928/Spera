const axios = require('axios');

const coinGeckoAPI = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

// Fetch cryptocurrency prices from CoinGecko
const getPrices = async () => {
  try {
    const response = await coinGeckoAPI.get('/simple/price', {
      params: {
        ids: 'bitcoin,ethereum,ripple,tether',
        vs_currencies: 'lkr',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = { getPrices };