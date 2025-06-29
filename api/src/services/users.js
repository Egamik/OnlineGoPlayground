'use strict'
const jwt = require('jsonwebtoken')
const User = require('../model/user')
const JWT_SECRET = process.env.JWT_SECRET || 'some-default-secret'

const registerUser = async (username, password) => {
    console.log('Register user called!!!')
    try {        

        const userFromDb = await User.findOne({ username })
        if (userFromDb) {
            throw new Error("Username already exists")
        }

        const newUser = new User({
            username: username,
            passwordHash: password // Expects a hashed password 
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
            throw new Error('User and password are required')
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

const updateUser = async (username, newPassword) => {
    console.log('Update user called!!!')
    try {
        const user = await User.findOne({ username })
        if (!user) {
            throw new Error('User not found')
        }

        user.passwordHash = newPassword
        await user.save()

        console.log(`User updated: ${username}`)
        return { message: 'User updated successfully' }

    } catch (error) {
        console.error('Update error:', error)
        throw new Error('User update failed: ' + error.message)
    }
}

module.exports = {
    registerUser,
    loginUser,
    updateUser
}