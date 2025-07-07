const express = require("express");
const cors = require("cors");
require('dotenv').config({path: '.env'});
const { connectToDatabase } = require("./config/database");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND, credentials: true }));

connectToDatabase();

// mount routes
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/userRoutes"));
app.head(process.env.PING, (_, res) => {
    console.log('Server is up and running');
    res.status(200).end();
});

// load cron jobs
require("./cron"); 

app.listen(process.env.PORT || 8000, () =>
  console.log("Server running on port", process.env.PORT || 8000)
);