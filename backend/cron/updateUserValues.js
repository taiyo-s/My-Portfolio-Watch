/**
 * Schedules a daily cron job to update all user portfolio values in the database.
 * Fetches users, populates their crypto collections, and recalculates each portfolio 
 * using portfolioService.
 */

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

// Schedule it to run once a day at 12:00
cron.schedule("0 12 * * *", updateAllUserPortfolios);

module.exports = updateAllUserPortfolios;