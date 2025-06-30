const submissionsService = require('../services/submissions')

// Store a new submission
const storeSubmissionHandler = async (req, res) => {
    console.log('Store submission called!!!')
    const { submissionID, code } = req.body
    const username = req.user.username

    if (!submissionID || !code) {
        return res.status(400).json({ error: 'Submission ID, and code are required' })
    }

    if (!username) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        await submissionsService.storeSubmission(username, submissionID, code)
        res.status(201).json({ message: 'Submission stored successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Get a submission by ID
const getSubmissionByIdHandler = async (req, res) => {
    console.log('Get submission by ID called!!!')
    if (!req.params || !req.params.submissionID) {
        return res.status(400).json({ error: 'Submission ID is required' })
    }

    const { submissionID } = req.params
    
    try {
        const submission = await submissionsService.getSubmissionById(submissionID)
        res.status(200).json(submission)
    } catch (error) {
        console.error('Error fetching submission:', error)
        res.status(404).json({ error: error.message })
    }
}

const getSubmissionsByUserHandler = async (req, res) => {
    console.log('Get submissions by user called!!!')
    const username = req.user.username

    if (!username) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }
    
    try {
        // Get own submissions
        const ownSubmissions = await submissionsService.getSubmissionsByUser(username)
        // Get submissions shared with this user
        const sharedSubmissions = await submissionsService.getSubmissionsSharedWithUser(username)
        // Merge and remove duplicates (by submissionID)
        const allSubmissions = [
            ...ownSubmissions,
            ...sharedSubmissions.filter(
                s => !ownSubmissions.some(os => os.submissionID === s.submissionID)
            )
        ]
        res.status(200).json(allSubmissions)
    } catch (error) {
        console.error('Error fetching submissions by user:', error)
        res.status(404).json({ error: error.message })
    }
}

// Share a submission with another user
const shareSubmissionHandler = async (req, res) => {
    const { submissionID, targetUsername } = req.body
    const ownerUsername = req.user.username

    if (!submissionID || !targetUsername) {
        return res.status(400).json({ error: 'Submission ID and target username are required' })
    }

    if (!ownerUsername) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const result = await submissionsService.shareSubmission(submissionID, ownerUsername, targetUsername)
        res.status(200).json(result)
    } catch (error) {
        console.error('Error sharing submission:', error)
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    storeSubmissionHandler,
    getSubmissionByIdHandler,
    shareSubmissionHandler,
    getSubmissionsByUserHandler
}