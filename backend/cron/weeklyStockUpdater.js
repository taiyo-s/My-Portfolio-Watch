/**
 * Weekly SP500 & company profile updater
 * Runs once a week: Sunday at 3am
 */

const cron = require('node-cron');
const axios = require('axios');
const StockPrice = require('../models/price_models/StockPrice');
const ExtraStock = require('../models/price_models/ExtraStocks');

const { sleep } = require('../shared/utils.js'); 

const FINNHUB_KEY = process.env.FINNHUB_KEY;
const FINNHUB_URL = `https://finnhub.io/api/v1/stock/profile2`;
const API_NINJAS_KEY = process.env.API_NINJAS_KEY;
const API_NINJAS_URL = 'https://api.api-ninjas.com/v1/sp500';

async function fetchCompanyProfile(ticker) {
    await sleep(1000); // 1/sec API limit
    try {
        const { data } = await axios.get(FINNHUB_URL, {
            params: { symbol: ticker, token: FINNHUB_KEY }
        });
        return data;
    } catch (err) {
        console.error(`Failed profile for ${ticker}:`, err.message);
        return null;
    }
}

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

async function fetchExtraTickers() {
    const docs = await ExtraStock.find().lean();
    return docs.map(d => d.ticker);
}

export async function weeklyUpdate() {
    try {
        console.log('Starting weekly S&P500 & profile update...');

        const sp500Tickers = await fetchSP500Tickers();
        const extraTickers = await fetchExtraTickers();

        const allTickers = new Set([...sp500Tickers, ...extraTickers]);
        const ops = [];

        for (const ticker of allTickers) {
            const existingProfile = await StockPrice.findById(ticker).lean();

            // Only fetch profile if ticker not stored yet
            if (!existingProfile) {
                const newProfile = await fetchCompanyProfile(ticker);
                if (!newProfile) continue;

                ops.push({
                    updateOne: {
                        filter: { _id: ticker },
                        update: {
                            $set: {
                                ticker,
                                name: newProfile.name || ticker,
                                exchange: newProfile.exchange || null,
                                currency: newProfile.currency || null
                            }
                        },
                        upsert: true
                    }
                });

                console.log(`Stored new company profile: ${ticker} (${profile.name})`);
            }
        }

        if (ops.length > 0) {
            await StockPrice.bulkWrite(ops, { ordered: false });
            console.log(`Weekly Update: Added ${ops.length} new companies`);
        } else {
            console.log('Weekly Update: No new companies found.');
        }

    } catch (err) {
        console.error('Weekly update failed:', err.message);
    }
}

// Run Sunday at 03:00
cron.schedule('0 3 * * 0', weeklyUpdate);

module.exports = weeklyUpdate;
