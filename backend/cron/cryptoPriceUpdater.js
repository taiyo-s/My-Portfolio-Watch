const cron = require("node-cron");
const axios = require("axios");
const CryptoPrice = require("../models/price_models/CryptoPrice");

const COIN_GECKO = 'https://api.coingecko.com/api/v3/coins/markets';

async function fetchTop50() {
	const { data } = await axios.get(COIN_GECKO, 
		{ params: {
		  vs_currency: 'usd',
		  order: 'market_cap_desc',
		  per_page: 50,
		  page: 1,
		},
		headers: {
			'x-cg-api-key': process.env.COIN_GECKO_KEY,
			accept: 'application/json',
		},
		timeout: 10000,
	  	},
	);

	// Keep only relevant values
	return data.map((c) => ({
		id: c.id,
		symbol: c.symbol.toUpperCase(),
		name: c.name,
		price: Number(c.current_price),
		rank: Number(c.market_cap_rank),
		last_updated: new Date(c.last_updated),
	}));            
}

async function updateCrypto() {
	try {
		const coins = await fetchTop50();
	
		const ops = coins.map(
			({ id, symbol, name, price, rank, last_updated }) => ({
				updateOne: {
					filter: { _id: id },
					update: {	
					$set: { symbol, name, price, rank, last_updated },
					},
					upsert: true,
				},
			}),
		);
  
		await CryptoPrice.bulkWrite(ops, { ordered: false });
		console.log(`${new Date().toISOString()} Updated ${ops.length} crypto`);
	} catch (err) {
	  console.error('CoinGecko fetch failed:', err.message);
	}
}

// run every 10 mins
cron.schedule('0 */10 * * * *', updateCrypto);
module.exports = updateCrypto;