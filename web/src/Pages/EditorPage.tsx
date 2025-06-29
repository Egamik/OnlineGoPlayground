import { useRef, useState } from "react"
import axios from 'axios'
import Editor, { OnMount } from "@monaco-editor/react"

async function requestRunCode(code: string) {
    try {
        const response = await axios.post('/run/go', {
            data: code
        })

        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const EditorPage = () => {
    const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
    const [editorContent, setEditorContent] = useState("")
    const [consoleOutput, setConsoleOutput] = useState<string[]>([])
    const [isRunning, setIsRunning] = useState(false)

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

        requestRunCode(content)
            .then(response => { addToConsole(response.data) })
            .catch(err => { console.log(err) })
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
        </div>
    )
}