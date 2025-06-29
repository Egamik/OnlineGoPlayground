const express = require('express')
const authMiddleware = require('../services/middleware.js')
const controller = require('../controller/user.controller.js')

const router = express.Router()

router.post('/register', controller.registerUserHandler)
router.post('/login', controller.loginUserHandler)
router.post('/update', authMiddleware.authenticateToken, controller.updateUserHandler)

module.exports = router