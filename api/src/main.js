const express = require('express')
const https = require('https')
const mongoose = require('mongoose')
const fs = require('fs')
const router = require('./routes/app.routes.js')

const app = express()
const PORT = 8080

// Limit body size
app.use(express.json({ limit: '1mb' }))

app.use(router)

// Initialize mongoose connection
mongoose.connect('mongodb://mongo:27017/api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))


const serverOptions = {
    key: fs.readFileSync('../certs/api-key.pem'),
    cert: fs.readFileSync('../certs/api-crt.pem'),
    ca: fs.readFileSync('../certs/ca-crt.pem'),
    requestCert: false,  // Change for producttion
    rejectUnauthorized: false
}

https.createServer(serverOptions, app).listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})