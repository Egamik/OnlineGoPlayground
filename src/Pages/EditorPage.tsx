import { useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";

export const EditorPage = () => {
  // Strongly type the editor ref (Monaco editor instance)
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
  const [editorContent, setEditorContent] = useState<string>("")

  // Called when the editor is mounted
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    console.log("Monaco instance loaded:", monaco)
  };

  // Get the current editor content
  const handleGetEditorContent = () => {
    if (editorRef.current) {
        const content = editorRef.current.getValue()
        setEditorContent(content)
        console.log("Editor content:", content)
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
                onChange={(value) => setEditorContent(value || "")}
            />
            <button onClick={handleGetEditorContent}>Run</button>
            <div>Current content length: {editorContent.length}</div>
        </div>
    )
}