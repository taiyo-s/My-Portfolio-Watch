/**
 * Schedules a cron job to update stock prices every 10 minutes using Finnhub and API-Ninjas.
 * Uses StockPrice and ExtraStock models to fetch, update, and store stock data.
 */

const cron = require('node-cron');
const axios = require('axios');
const StockPrice = require('../models/price_models/StockPrice');
const ExtraStock = require('../models/price_models/ExtraStocks');

const FINNHUB_KEY = process.env.FINNHUB_KEY;
const FINNHUB_URL = `https://finnhub.io/api/v1/stock/profile2`;
const API_NINJAS_KEY = process.env.API_NINJAS_KEY;
const API_NINJAS_URL = 'https://api.api-ninjas.com/v1/sp500';

// Helper to delay between requests
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch S&P500 tickers from API-Ninjas
async function fetchSP500Tickers() {
    try {
        const { data } = await axios.get(API_NINJAS_URL, {
            headers: { 'X-Api-Key': API_NINJAS_KEY },
        });
        return data.map(c => c.ticker);
    } catch (err) {
        console.error('Failed to fetch S&P500 tickers:', err.message);
        return [];
    }
}

// Fetch extra tickers from MongoDB
async function fetchExtraTickers() {
    const docs = await ExtraStock.find().lean();
    return docs.map(d => d.ticker);
}

// Fetch Finnhub company profile (exchange & currency)
async function fetchCompanyProfile(ticker) {
try {
    const { data } = await axios.get(FINNHUB_URL, {
        params: { 
            symbol: ticker, 
            token: FINNHUB_KEY 
        }
    });
    return data;
} catch (err) {
    console.error(`Failed to fetch profile for ${ticker}:`, err.message);
    return null;
}
}

// Fetch Finnhub quote
async function fetchQuote(ticker) {
try {
    const { data } = await axios.get(`https://finnhub.io/api/v1/quote`, {
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

// Main updater
async function updateStocks() {
try {
    const sp500Tickers = await fetchSP500Tickers();
    const extraTickers = await fetchExtraTickers();
    const allTickers = new Set([...sp500Tickers, ...extraTickers]);

    const ops = [];

    for (const ticker of allTickers) {
        const profile = await fetchCompanyProfile(ticker);
        const quote = await fetchQuote(ticker);

        if (profile && quote) {
            ops.push({
            updateOne: {
                filter: { _id: ticker },
                update: {
                    $set: {
                        ticker,
                        name: profile.name || ticker,
                        price: quote.c,
                        last_updated: new Date(quote.t * 1000),
                        exchange: profile.exchange || null,
                        currency: profile.currency || null
                    }
                },
                upsert: true
            }
            });
        }

        // Delay to stay under Finnhub free-tier limits (~60/min)
        await sleep(1000); // 1 second
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
