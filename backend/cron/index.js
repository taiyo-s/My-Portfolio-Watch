/**
 * Entry point for cron jobs. Loads and runs scheduled updaters for crypto and stock prices.
 */

require("./cryptoPriceUpdater");
require("./stockPriceUpdater");
require("./weeklyStockUpdater");
//require("./updateUserValues");