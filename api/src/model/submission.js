const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Owner's username
    submissionID: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    ownerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of User IDs
})

const Submission = mongoose.model('Submission', submissionSchema)

module.exports = Submission
