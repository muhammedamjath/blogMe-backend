const { urlencoded } = require('body-parser')
const express = require('express')
require('dotenv').config()
const app = express()

const port = process.env.PORT

app.use(express.json())
app.use(urlencoded({extended:true}))

const dbConnect = require('./config/connection')

dbConnect().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error("Database connection failed:", err);
});


