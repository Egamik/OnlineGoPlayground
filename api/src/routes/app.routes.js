const express = require('express')
const { runGo } = require('../controller/gorunner.controller.js')
const subRouter = require('../routes/submission.routes.js')
const userRouter = require('../routes/user.routes.js')
const authMiddleware = require('../services/middleware.js')

const router = express.Router()

router.use('/user', userRouter)

router.post('/run/go', authMiddleware.authenticateToken, runGo)

router.use('/submissions', authMiddleware.authenticateToken, subRouter)


module.exports = router