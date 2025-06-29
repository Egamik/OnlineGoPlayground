'use strict'

const docker = require('dockerode')

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

module.exports = {
    executeGoCode
}