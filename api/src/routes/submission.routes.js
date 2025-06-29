'use strict'
const express = require('express')
const router = express.Router()
const controller = require('../controller/submission.controller.js')

router.post('/store', controller.storeSubmissionHandler)
router.post('/share', controller.shareSubmissionHandler)
router.get('/id', controller.getSubmissionByIdHandler)
router.get('/user', controller.getSubmissionsByUserHandler)

module.exports = router