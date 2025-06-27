'use strict'

const fs = require('fs')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)
const rmdir = util.promisify(fs.rm)

const gorunner = require('../services/gorunner')

const runGo = async (req, res) => {
    console.log('Execute go called!!!')
    try {
        const { code } = req.body.data
        
        if (!code || typeof code !== 'string') {
            return res.status(400).json({ error: 'Valid Go code is required' })
        }

        // Create unique directory for this execution
        const execId = crypto.randomBytes(8).toString('hex')
        const workDir = path.join('/tmp', `go-exec-${execId}`)
        await mkdir(workDir)

        // Write main.go file
        await writeFile(path.join(workDir, 'main.go'), code)

        const result = await gorunner.executeGoCode(code)
        
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

const registerUser = async (req, res) => {
    console.log('Register user called!!!')
    const { username, password } = req.body.data
    
    try {
        
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' })
            return
        }
        
        const response = await registerUser(username, password)
        res.status(200).json(response)

    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ 
            error: 'User registration failed',
            details: error.message 
        })
    }
}

const loginUser = async (req, res) => {
    console.log('Login user called!!!')
    const { username, password } = req.body.data

    try {
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' })
            return
        }

        const token = await loginUser(username, password)
        res.status(200).json({ token })

    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({
            error: 'User login failed',
            details: error.message
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
    registerUser,
    authenticateToken
}
