'use strict'
const jwt = require('jsonwebtoken')
const User = require('../model/user')
const JWT_SECRET = process.env.JWT_SECRET || 'some-default-secret'

const registerUser = async (username, password) => {
    console.log('Register user called!!!')
    try {        

        const userFromDb = await User.findOne({ username })
        if (userFromDb) {
            return res.status(400).json({ error: 'Username already exists' })
        }

        const newUser = new User({
            username,
            password: password // Expects a hashed password 
        })
        
        await newUser.save()

        console.log(`User registered: ${username}`)
        return { message: 'User registered successfully' }

    } catch (error) {
        console.error('Registration error:', error)
        throw new Error('User registration failed: ' + error.message)
    }
}

const loginUser = async (username, password) => {
    console.log('Login user called!!!')
    try {        
        if (!username || !password) {
            throw new Error('Username and password are required')
        }

        const user = await User.findOne({ username })
        if (!user) {
            throw new Error('Invalid username or password')
        }

        if (user.password !== password) {
            throw new Error('Invalid username or password')
        }

        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' })
        console.log(`User logged in: ${username}`)
        console.log('Generated token:', token)
        
        return token

    } catch (error) {
        throw new Error('User login failed: ' + error.message)
    }
}

module.exports = {
    registerUser,
    loginUser
}