const cron        = require('node-cron');
const axios       = require('axios');
const CryptoPrice = require('../models/price_models/CryptoPrice');

const COIN_GECKO = 'https://api.coingecko.com/api/v3/coins/markets';

/**
 * ---- one-line Axios wrapper with a response-logging tap ----
 */
const cg = axios.create({ timeout: 10_000 });

cg.interceptors.response.use(
  (res) => res,                                // pass through on success
  (err) => {
    // Only if the server responded (=> 4xx / 5xx) – network errors have no err.response
    if (err.response) {
      const { status, headers, data } = err.response;
      console.error('--- CoinGecko 4xx/5xx ---');
      console.error('status :', status);
      console.error('headers:', headers);
      console.error('body   :', typeof data === 'object' ? JSON.stringify(data) : data);
      console.error('--------------------------------');
    } else {
      console.error('--- No response from CoinGecko (network error) ---');
      console.error(err.message);
      console.error('--------------------------------');
    }
    throw err;                                 // keep the promise chain behaviour
  }
);

/**
 * Pull the top-50 coins and keep only the fields we need
 */
async function fetchTop50() {
  const { data } = await cg.get(COIN_GECKO, {
    params: {
      vs_currency : 'usd',
      order : 'market_cap_desc',
      per_page : 50,
      page : 1,
    },
    headers: {
      'x-cg-demo-api-key': process.env.COIN_GECKO_KEY,   
      'User-Agent' : 'MyPortfolioWatch/1.0',
      'Accept' : 'application/json',
    },
  });

  return data.map((c) => ({
    id : c.id,
    symbol : c.symbol.toUpperCase(),
    name : c.name,
    price : Number(c.current_price),
    rank : Number(c.market_cap_rank),
    last_updated : new Date(c.last_updated),
  }));
}

/**
 * Bulk-upsert the latest prices into MongoDB
 */
async function updateCrypto() {
  try {
    const coins = await fetchTop50();

    const ops = coins.map(({ id, symbol, name, price, rank, last_updated }) => ({
      updateOne: {
        filter : { _id: id },
        update : { $set: { symbol, name, price, rank, last_updated } },
        upsert : true,
      },
    }));

    await CryptoPrice.bulkWrite(ops, { ordered: false });
    console.log(`${new Date().toISOString()} Updated ${ops.length} crypto`);
  } catch (err) {
    console.error('CoinGecko fetch failed:', err.message);
  }
}

// Run every 10 minutes
cron.schedule('*/1 * * * *', updateCrypto);

module.exports = updateCrypto;