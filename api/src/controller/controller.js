'use strict'

const fs = require('node:fs')
const util = require('node:util')
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)
const rmdir = util.promisify(fs.rm)

const gorunner = require('../services/gorunner')
const userService = require('../services/users')

const runGo = async (req, res) => {
    console.log('Execute go called!!!')
    try {
        const { code } = req.body.data

        if (!req.user || !req.user.username) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }
        
        if (!code || typeof code !== 'string') {
            res.status(400).json({ error: 'Valid Go code is required' })
            return
        }

        
        // Create unique directory for this execution
        const execId = crypto.randomBytes(8).toString('hex')

        await gorunner.storeSubmission(req.user.username, execId, code)
        
        const workDir = path.join('/tmp', `go-exec-${execId}`)
        
        await mkdir(workDir)

        // Write main.go file
        await writeFile(path.join(workDir, 'main.go'), code)

        const result = await gorunner.executeGoCode(workDir)

        // Cleanup
        await rmdir(workDir, { recursive: true, force: true })
        
        // Log the result
        console.log('Finished execution: ', result)

        res.status(200).json({ result })
    } catch (error) {
        console.error('Execution error:', error)
        res.status(500).json({ 
            error: 'Code execution failed',
            details: error.message 
        })
    }
}

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

    try {
        if (!user || !newPassword) {
            res.status(400).json({ error: 'User and new password are required' })
            return
        }

        const response = await userService.updateUser(user.username, newPassword)
        res.status(200).json(response)
    } catch (error) {
        console.error('Update error:', error)
        res.status(500).json({
            error: 'User update failed'
        })
    }
}

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

module.exports = {
    runGo,
    registerUserHandler,
    loginUserHandler,
    updateUserHandler,
    authenticateToken
}
