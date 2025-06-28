const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
    username: { type: String, required: true },
    submissionID: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

const Submission = mongoose.model('Submission', submissionSchema)

module.exports = Submission
