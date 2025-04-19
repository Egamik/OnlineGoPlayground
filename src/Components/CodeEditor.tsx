import React, { useRef, useState } from "react"
import Editor, { OnMount } from "@monaco-editor/react"

interface CodeEditorProps {
    setEditorContent: React.Dispatch<React.SetStateAction<string>>
}

export const CodeEditor = (props: CodeEditorProps) => {
    // Strongly type the editor ref (Monaco editor instance)
    const editorRef = useRef<Parameters<OnMount>[0] | null>(null)

    // Called when the editor is mounted
    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor
        console.log("Monaco instance loaded:", monaco)
    };

    // Get the current editor content
    const handleGetEditorContent = () => {
        if (editorRef.current) {
            const content = editorRef.current.getValue()
            props.setEditorContent(content)
            return content
        }
        return ""
    }

    return (
        <div>
            <Editor
                height="90vh"
                width="98vw"
                theme="vs-dark"
                defaultLanguage="go"
                onMount={handleEditorDidMount}
                // onChange={(value) => setEditorContent(value || "")}
            />
            <button onClick={handleGetEditorContent}>Run</button>
        </div>
    )
}