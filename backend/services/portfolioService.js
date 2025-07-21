const Crypto = require("../models/user_models/Crypto");
const CryptoPrice = require("../models/price_models/CryptoPrice");

async function recalculateUserPortfolio(user, { isCron = false } = {}) {
	if (!user || !user.cryptoCollection?.cryptoCollection) return user;

	const holdings = user.cryptoCollection?.cryptoCollection || [];

	let totalValue = 0;

	for (const holding of holdings) {

		const crypto = await CryptoPrice.findOne({ symbol: holding.symbol.toUpperCase() });
		if (!crypto) continue;
		
		await Crypto.findByIdAndUpdate(holding._id, {
			currentUnitPrice: crypto.price,
			currentValue: holding.amount * crypto.price,
		});

		totalValue += holding.currentValue;
	}

	user.overallValue = totalValue;
	if (isCron) {
		user.valueHistory.push(totalValue);
		user.updatedAt.push(new Date());
	} else {
		if (user.valueHistory.length > 0) {
			user.valueHistory[user.valueHistory.length - 1] = totalValue;
		} else {
			user.valueHistory.push(totalValue);
		}
		if (user.updatedAt.length > 0) {
			user.updatedAt[user.updatedAt.length - 1] = new Date();
		} else {
			user.updatedAt.push(new Date());
		}
	}
	await user.save();

	return user;
}

module.exports = { recalculateUserPortfolio };