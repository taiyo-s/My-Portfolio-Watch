/**
 * Schedules a cron job to update stock prices every 20 minutes using Finnhub.
 * Uses StockPrice models to fetch, update, and store stock data.
 */

const cron = require('node-cron');
const axios = require('axios');
const StockPrice = require('../models/price_models/StockPrice');

const { sleep } = require('../shared/utils.js');

const FINNHUB_KEY = process.env.FINNHUB_KEY;
const FINNHUB_URL = `https://finnhub.io/api/v1/stock/profile2`;

// Fetch Finnhub quote
async function fetchQuote(ticker) {
    await sleep(1000); 
    try {
        const { data } = await axios.get(FINNHUB_URL, {
            params: { 
                symbol: ticker, 
                token: FINNHUB_KEY 
            }
        });
        return data;
    } catch (err) {
        console.error(`Failed to fetch quote for ${ticker}:`, err.message);
        return null;
    }
}

async function updateStocks() {
    try {
        const tickers = await StockPrice.find({}, { _id: 1 }).lean();
        const ops = [];

        for (const doc of tickers) {
            const ticker = doc._id;
            const quote = await fetchQuote(ticker);
            if (!quote) continue;

            ops.push({
                updateOne: {
                    filter: { _id: ticker },
                    update: {
                        $set: {
                            price: quote.c,
                            last_updated: new Date(quote.t * 1000)
                        }
                    }
                }
            });
        }

        if (ops.length > 0) {
            await StockPrice.bulkWrite(ops, { ordered: false });
            console.log(`${new Date().toISOString()} Updated ${ops.length} stocks`);
        } else {
            console.log('No stock updates to write.');
        }

    } catch (err) {
        console.error('Stock update failed:', err.message);
    }
}

// Run every 20 minutes
cron.schedule('0,20,40 * * * *', updateStocks);

module.exports = updateStocks;
