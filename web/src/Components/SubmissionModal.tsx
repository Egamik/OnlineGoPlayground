import React, { useEffect, useState, useContext } from "react"
import { AuthContext } from "../util/UserCtx"
import axios from "axios"

interface Submission {
    submissionID: string
    createdAt: string
}

interface SubmissionModalProps {
    onSelect: (submissionID: string) => void
    onClose?: () => void
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({ onSelect, onClose }) => {
    const authCtx = useContext(AuthContext)
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchSubmissions = async () => {
            setLoading(true)
            setError("")
            try {
                if (!authCtx?.username) {
                    setError("Not authenticated")
                    setLoading(false)
                    return
                }

                const res = await axios.get(`/api/submissions/user/${authCtx.username}`)
                if (res.status === 200 && Array.isArray(res.data)) {
                    // Sort by createdAt descending
                    const sorted = [...res.data].sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                    setSubmissions(sorted)
                } else {
                    setError("Failed to fetch submissions")
                }
            } catch (err) {
                console.error("Error fetching submissions:", err)
                setError("Error fetching submissions")
            }
            setLoading(false)
        }
        fetchSubmissions()
    }, [authCtx?.username])

    return (
        <div className="modal-bg">
            <div className="modal-content submission-modal">
                <div className="modal-header">
                    <h3>Your Submissions</h3>
                    {onClose && (
                        <button className="modal-close-btn" onClick={onClose} title="Close">&times;</button>
                    )}
                </div>
                {loading ? (
                    <div className="modal-loading">Loading...</div>
                ) : error ? (
                    <div className="modal-error">{error}</div>
                ) : (
                    <div className="submission-table-wrapper">
                        <table className="submission-table">
                            <thead>
                                <tr>
                                    <th>Submission ID</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map(sub => (
                                    <tr key={sub.submissionID} className="submission-row">
                                        <td
                                            className="submission-id"
                                            onClick={() => onSelect(sub.submissionID)}
                                            title="Click to load"
                                        >
                                            {sub.submissionID}
                                        </td>
                                        <td
                                            className="submission-date"
                                            onClick={() => onSelect(sub.submissionID)}
                                            title="Click to load"
                                        >
                                            {new Date(sub.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {submissions.length === 0 && (
                            <div className="modal-empty">No submissions found.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SubmissionModal