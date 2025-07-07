const cron = require("node-cron");

cron.schedule("0 */2 * * *", () => {
  console.log("cron job");
});