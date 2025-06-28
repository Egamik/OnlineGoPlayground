const express = require('express')
const router = express.Router()
const controller = require('../controller/controller.js')

router.post('/run/go', controller.runGo)

// User routes
router.post('/user/register', controller.registerUserHandler)
router.post('/user/login', controller.loginUserHandler)
router.post('/user/update', controller.updateUserHandler)

module.exports = router