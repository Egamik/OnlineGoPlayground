const express = require('express')
const router = express.Router()
const goController = require('../controllers/goController')

router.post('/run/go', goController.runGo)

module.exports = router