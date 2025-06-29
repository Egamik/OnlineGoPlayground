'use strict'

const fs = require('node:fs')
const util = require('node:util')
const crypto = require('node:crypto')
const path = require('node:path')
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)
const rmdir = util.promisify(fs.rm)
const gorunner = require('../services/gorunner')
const subService = require('../services/submissions')

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

        await subService.storeSubmission(req.user.username, execId, code)
        
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

module.exports = { runGo }
