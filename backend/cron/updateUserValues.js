const cron = require("node-cron");
const User = require("../models/user_models/User");
const { recalculateUserPortfolio } = require("../services/portfolioService");

async function updateAllUserPortfolios() {
  try {
    const users = await User.find({}).populate({
      path: "cryptoCollection",
      populate: {
        path: "cryptoCollection",
        model: "Crypto",
      },
    });

    let updatedCount = 0;

    for (let user of users) {
        await recalculateUserPortfolio(user, { isCron: true });
      updatedCount++;
    }

    console.log(`[${new Date().toISOString()}] Updated ${updatedCount} user portfolios.`);
  } catch (err) {
    console.error("Error updating portfolios:", err.message);
  }
}

// Schedule it to run at 01:00, 07:00, 13:00, 19:00
cron.schedule("0 1,7,13,19 * * *", updateAllUserPortfolios);

module.exports = updateAllUserPortfolios;