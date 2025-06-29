'use strict'

const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'some-default-secret'
const userService = require('../services/users')

const registerUserHandler = async (req, res) => {
    console.log('Register user called!!!')
    const { username, password } = req.body.data
    
    try {
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' })
            return
        }
        
        const response = await userService.registerUser(username, password)
        res.status(200).json(response)
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ 
            error: 'User registration failed',
            details: error.message 
        })
    }
}

const loginUserHandler = async (req, res) => {
    console.log('Login user called!!!')
    const { username, password } = req.body.data

    try {
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' })
            return
        }

        const token = await userService.loginUser(username, password)
        res.status(200).json({ token })

    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({
            error: 'User login failed',
            details: error.message
        })
    }
}

const updateUserHandler = async (req, res) => {
    const user = req.user
    const { newPassword } = req.body.data

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!newPassword) {
        res.status(400).json({ error: 'New password is required' })
        return
    }
    
    try {
        const response = await userService.updateUser(user.username, newPassword)
        res.status(200).json(response)
    } catch (error) {
        console.error('Update error:', error)
        res.status(500).json({
            error: 'User update failed'
        })
    }
}

module.exports = {
    registerUserHandler,
    loginUserHandler,
    updateUserHandler
}