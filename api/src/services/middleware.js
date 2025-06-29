'use strict'
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'some-default-secret'

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) return res.status(401).json({ error: 'Access token is required' })
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid access token' })
        req.user = user
        next()
    })
}

module.exports = { authenticateToken }