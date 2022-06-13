const express = require('express')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const app = express()

// Load environment variables (.env)
require('dotenv').config()
const port = process.env.LISTEN_PORT || 3001
const address = process.env.LISTEN_ADDRESS || 'localhost'

// Connect to db
mongoose.connect(process.env.MONGO_URL)

// Important middleware
app.use(express.json())
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: mongoStore.create({mongoUrl: process.env.MONGO_URL}),
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 hour
    },
}))

// Register router
require('./routes/router').registerRoutes(app)


app.listen(port, address, () => console.log(`Server listening on ${address}:${port}`))