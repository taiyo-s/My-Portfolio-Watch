const express = require("express");
// const path = require("path");
// const bodyParser = require('body-parser');
// const bcrypt = require("bcrypt");
const cors = require("cors")
const userSchema = require("./models/User")
require('dotenv').config({path: '.env'});

const app = express();
app.use(express.json())
app.use(cors())


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {dbName: "User-data"})
.then(() => {
    console.log("MongoDB connected succesfully");
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

app.post('/register', (req, res) => {
    userSchema.create(req.body)
    .then(user => res.json(user))
    .catch(error => res.json(error))
})

const port = 8000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
