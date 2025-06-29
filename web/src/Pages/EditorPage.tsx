import { useRef, useState } from "react"
import axios from 'axios'
import Editor, { OnMount } from "@monaco-editor/react"
import SubmissionModal from "../Components/SubmissionModal"

type ModalPurpose = "load" | "share" | null

export const EditorPage = () => {
    const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
    const [editorContent, setEditorContent] = useState("")
    const [consoleOutput, setConsoleOutput] = useState<string[]>([])
    const [isRunning, setIsRunning] = useState(false)
    const [showSubmissionModal, setShowSubmissionModal] = useState(false)
    const [modalPurpose, setModalPurpose] = useState<ModalPurpose>(null)

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor
        addToConsole("Editor initialized - Ready for Go code")
    }

    const handleGetEditorContent = () => {
        if (!editorRef.current) return ""
        
        setIsRunning(true)
        const content = editorRef.current.getValue()
        setEditorContent(content)
        
        addToConsole("Running code...")

        axios.post("/api/run/go", { code: content })
            .then(response => { addToConsole(response.data) })
            .catch(err => { 
                console.error(err) 
                addToConsole("Error running code: " + err)
            })
            .finally(() => { setIsRunning(false) })
        
        return content
    }

    const handleClearEditor = () => {
        if (editorRef.current) {
            editorRef.current.setValue("")
            setEditorContent("")
            addToConsole("Editor cleared")
        }
    }

    const handleClearConsole = () => {
        setConsoleOutput([])
    }

    const handleLoadSubmission = () => {
        setModalPurpose("load")
        setShowSubmissionModal(true)
    }

    const handleShareClick = () => {
        setModalPurpose("share")
        setShowSubmissionModal(true)
    }

    const handleModalClose = () => {
        setShowSubmissionModal(false)
        setModalPurpose(null)
    }

    // Handler for loading a submission into the editor
    const handleSubmissionLoad = async (submissionID: string) => {
        setShowSubmissionModal(false)
        setModalPurpose(null)
        try {
            const res = await axios.get(`/api/submissions/id/${submissionID}`)
            if (res.status === 200 && res.data && res.data.code && editorRef.current) {
                editorRef.current.setValue(res.data.code)
                setEditorContent(res.data.code)
                addToConsole(`Loaded submission: ${submissionID}`)
            } else {
                addToConsole("Failed to load submission.")
            }
        } catch (err) {
            console.error("Error loading submission:", err)
            addToConsole("Error loading submission.")
        }
    }

    // Handler for sharing a submission (implement your sharing logic here)
    const handleSubmissionShare = (submissionID: string) => {
        setShowSubmissionModal(false)
        setModalPurpose(null)
        addToConsole(`Share logic for submission: ${submissionID}`)
        // You can open another modal or call your share API here
    }

    const addToConsole = (message: string) => {
        const timestamp = new Date().toLocaleTimeString()
        setConsoleOutput(prev => [...prev, `[${timestamp}] ${message}`])
    }

    return (
        <div className="editor-container">
            <div className="editor-controls">
                <button 
                    onClick={handleGetEditorContent}
                    className={`editor-button run-button ${isRunning ? "running" : ""}`}
                    disabled={isRunning}
                >
                    {isRunning ? "Running..." : "Run"}
                </button>
                <button 
                    onClick={handleClearEditor}
                    className="editor-button clear-button"
                >
                    Clear Editor
                </button>
                <button 
                    onClick={handleClearConsole}
                    className="editor-button console-button"
                >
                    Clear Console
                </button>
                <button
                    onClick={handleLoadSubmission}
                    className="editor-button console-button"
                >
                    Load
                </button>
                <button
                    onClick={handleShareClick}
                    className="editor-button console-button"
                >
                    Share
                </button>
                <div className="editor-info">
                    {editorContent.length} chars | {editorContent.split("\n").length} lines
                </div>
            </div>
            
            <Editor
                height="60vh"
                width="90vw"
                theme="vs-dark"
                defaultLanguage="go"
                defaultValue=""
                onMount={handleEditorDidMount}
                onChange={(value) => setEditorContent(value || "")}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false
                }}
            />
            
            <div className="console-container">
                <div className="console-header">
                    Console Output:
                    <span className="console-status">
                        {consoleOutput.length} messages
                    </span>
                </div>
                <div className="console-output">
                    {consoleOutput.length > 0 ? (
                        consoleOutput.map((line, index) => (
                            <div key={index} className="console-line">
                                {line}
                            </div>
                        ))
                    ) : (
                        <div className="console-empty">
                            No messages - Run your code to see output
                        </div>
                    )}
                </div>
            </div>
            {showSubmissionModal && (
                <SubmissionModal
                    onSelect={modalPurpose === "load" ? handleSubmissionLoad : handleSubmissionShare}
                    onClose={handleModalClose}
                />
            )}
        </div>
    )
}