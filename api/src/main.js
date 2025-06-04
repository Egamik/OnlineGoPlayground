const express = require('express')
const fs = require('fs')
const util = require('util')
const docker = require('dockerode')()
const path = require('path')
const crypto = require('crypto')
const https = require('https')

const app = express()
const PORT = 8080
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)
const rmdir = util.promisify(fs.rm)

// Limit body size
app.use(express.json({ limit: '1mb' }))

app.post('/run/go', async (req, res) => {
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

        const result = await executeGoCode(workDir)
        
        // Cleanup
        await rmdir(workDir, { recursive: true, force: true })

        console.log('Finished execution: ', result)

        res.status(200).json({ result })
    } catch (error) {
        console.error('Execution error:', error)
        res.status(500).json({ 
            error: 'Code execution failed',
            details: error.message 
        })
    }
})

async function executeGoCode(workDir) {
    return new Promise((resolve, reject) => {
        const containerOptions = {
            Image: 'golang:latest-alpine',
            Cmd: ['sh', '-c', 'cd /app && go mod init app && go mod tidy && go run .'],
            WorkingDir: '/app',
            HostConfig: {
                AutoRemove: true,
                Memory: 100 * 1024 * 1024, // 100MB
                NetworkMode: 'none',       // No network access
                ReadonlyRootfs: true,      // Root filesystem is read-only
                Binds: [
                    `${workDir}:/app:rw`   // Only /app is writable
                ],
                PidsLimit: 50,
                CapDrop: ['ALL'],          // Drop all capabilities
                SecurityOpt: ['no-new-privileges']
            },
            User: 'nobody',                // Run as unprivileged user
            AttachStdout: true,
            AttachStderr: true,
            Tty: false,
            Env: [
                'GOCACHE=/tmp/.cache',    // Set cache location to writable tmp
                'GOPATH=/tmp/go'           // Set GOPATH to tmp
            ]
        }

        console.log('Before')
        docker.createContainer(containerOptions, (err, container) => {
            console.log('Create container')
            if (err) return reject(err)

            let output = ''
            let errorOutput = ''
            let timer
            
            container.attach({ stream: true, stdout: true, stderr: true }, (err, stream) => {
                if (err) return reject(err)

                timer = setTimeout(() => {
                    stream.destroy()
                    container.stop(() => reject(new Error('Execution timeout (15s)')))
                }, 15000) // 15 seconds timeout

                stream.on('data', (chunk) => {
                    const data = chunk.toString()
                    // Combine stdout and stderr
                    output += data
                    
                    // Check output size limit
                    if (output.length > 2 * 1024 * 1024) { // 2MB output limit
                        stream.destroy()
                        container.stop(() => reject(new Error('Output too large (>2MB)')))
                    }
                })

                stream.on('end', () => {
                    clearTimeout(timer)
                    if (errorOutput) {
                        reject(new Error(errorOutput))
                    } else {
                        resolve(output)
                    }
                })
            })

            container.start((err) => {
                if (err) return reject(err)
            })
        })
    })
}

const serverOptions = {
    key: fs.readFileSync('../certs/api-key.pem'),
    cert: fs.readFileSync('../certs/api-crt.pem'),
    ca: fs.readFileSync('../certs/ca-crt.pem'),
    requestCert: true,
    rejectUnauthorized: true
}

https.createServer(serverOptions, app).listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})