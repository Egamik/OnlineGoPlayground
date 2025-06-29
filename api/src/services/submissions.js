const Submission = require('../model/submission')
const User = require('../model/user')

async function storeSubmission(username, submissionID, code) {
    try {
        const user = await User.findOne({ username })
        if (!user) throw new Error('User not found')

        const submission = new Submission({
            username,
            submissionID,
            code,
            ownerID: user._id,
            sharedWith: []
        })
        await submission.save()
        console.log('Submission stored successfully')
    } catch (error) {
        console.error('Error storing submission:', error)
        throw new Error('Failed to store submission: ' + error.message)
    }
}

async function getSubmissionById(submissionID) {
    try {
        const submission = await Submission.findOne({ submissionID })
        if (!submission) throw new Error('Submission not found')
        return submission
    } catch (error) {
        console.error('Error fetching submission:', error)
        throw new Error('Failed to fetch submission: ' + error.message)
    }
}

async function shareSubmission(submissionID, ownerUsername, targetUsername) {
    try {
        const owner = await User.findOne({ username: ownerUsername })
        const target = await User.findOne({ username: targetUsername })
        
        if (!owner || !target) throw new Error('User not found')
    
        const submission = await Submission.findOne({ submissionID, ownerID: owner._id })
        if (!submission) throw new Error('Submission not found or not owned by user')
    
        if (!submission.sharedWith.includes(target._id)) {
            submission.sharedWith.push(target._id)
            await submission.save()
        }
        return { message: 'Submission shared successfully' }
    } catch (error) {
        console.error('Error sharing submission:', error)
        throw new Error('Failed to share submission: ' + error.message)
    }
}

async function getSubmissionsByUser(username) {
    try {
        const user = await User.findOne({ username })
        if (!user) throw new Error('User not found')

        const submissions = await Submission.find({ ownerID: user._id })
        return submissions
    } catch (error) {
        console.error('Error fetching submissions by owner:', error)
        throw new Error('Failed to fetch submissions by owner: ' + error.message)
    }
}

module.exports = {
    storeSubmission,
    getSubmissionById,
    shareSubmission,
    getSubmissionsByUser
}