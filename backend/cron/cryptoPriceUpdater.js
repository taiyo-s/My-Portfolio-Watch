const cron        = require('node-cron');
const axios       = require('axios');
const CryptoPrice = require('../models/price_models/CryptoPrice');

const CMC_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

async function fetchTop50() {
	const { data } = await axios.get(CMC_URL, {
		params: {
		start : 1,         
		limit : 50,        
		sort : 'market_cap',
		sort_dir: 'desc',
		convert : 'USD',
		},
		headers: {
		'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_KEY, 
		},
	});


	return data.data.map((c) => ({
	id : c.slug,                    
	symbol : c.symbol.toUpperCase(),
	name : c.name,
	price : Number(c.quote.USD.price.toFixed(2)),
	rank : Number(c.cmc_rank),
	last_updated : new Date(c.last_updated),
	}));
}

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
	console.error('CoinMarketCap fetch failed:', err.message);
	}
}

// Run every 10 minutes
cron.schedule('*/10 * * * *', updateCrypto);

module.exports = updateCrypto;