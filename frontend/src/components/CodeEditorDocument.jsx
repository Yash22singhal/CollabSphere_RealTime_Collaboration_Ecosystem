import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import MonacoEditor from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { AppContext } from "../context/AppContext";
import AISideChat from "./AiSideChat"; // Ensure this path is correct
import axios from "axios";

const SAVE_INTERVAL_MS = 3000;

// SVG Icon Placeholders (you can replace these with a proper icon library if you use one)
const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4"
  >
    <path d="M6.3 2.841A1.5 1.5 0 004 4.118v11.764a1.5 1.5 0 002.3 1.277l9.344-5.882a1.5 1.5 0 000-2.553L6.3 2.84z" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4"
  >
    <path
      fillRule="evenodd"
      d="M7.455 2.508a.75.75 0 00-.965.527l-.294 1.176a6.994 6.994 0 00-3.925 3.925l-1.176.294a.75.75 0 00-.527.965 7.592 7.592 0 009.074 9.074.75.75 0 00.965-.527l.294-1.176a6.994 6.994 0 003.925-3.925l1.176-.294a.75.75 0 00.527-.965A7.592 7.592 0 007.455 2.508zM11.5 10.75a2.25 2.25 0 10-4.5 0 2.25 2.25 0 004.5 0z"
      clipRule="evenodd"
    />
  </svg>
);

const CodeEditor = () => {
  const { id: documentId } = useParams();
  const { url, token } = useContext(AppContext);
  const [code, setCode] = useState("// Start coding here...");
  const [language, setLanguage] = useState("javascript");
  const [isAISideChatOpen, setIsAISideChatOpen] = useState(false); // Set to true to see it by default
  const [selectedText, setSelectedText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const editorRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const saveDocument = useCallback(
    async (codeToSave) => {
      if (!documentId) return;
      setIsSaving(true);
      try {
        await fetch(`${url}/api/documents/${documentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: codeToSave }),
        });
      } catch (err) {
        console.error("Error saving document:", err);
      } finally {
        setIsSaving(false);
      }
    },
    [documentId, token, url]
  );

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.onDidChangeCursorSelection((e) => {
      const selected = editor.getModel().getValueInRange(e.selection);
      setSelectedText(selected);
      // Automatically open AI chat on text selection if you want that behavior
      if (selected) {
        setIsAISideChatOpen(true);
      }
    });
  };

  const handleApplyAIResponse = (newText) => {
    const editor = editorRef.current;
    if (!editor || !selectedText) return; // Ensure selectedText is also checked
    const selection = editor.getSelection();
    if (selection) {
      // Check if selection is not null
      editor.executeEdits(null, [
        {
          range: selection,
          text: newText,
          forceMoveMarkers: true,
        },
      ]);
    }
    setSelectedText("");
    // setIsAISideChatOpen(false); // Optionally close AI chat after applying
  };

  const getLanguageId = (lang) => {
    switch (lang) {
      case "javascript":
        return 63;
      case "python":
        return 71;
      case "cpp":
        return 54;
      case "java":
        return 62;
      case "c":
        return 50;
      case "typescript":
        return 74;
      case "go":
        return 60;
      case "ruby":
        return 72;
      default:
        return 63;
    }
  };

  const executeCode = async () => {
    setExecutionResult("Executing..."); // Provide immediate feedback
    try {
      const response = await axios.post(`${url}/api/code/execute`, {
        source_code: code,
        language_id: getLanguageId(language),
        stdin: "", // Add an input field for stdin later if needed
      });

      if (response.data) {
        let output = "";
        if (response.data.stdout) output += response.data.stdout;
        if (response.data.stderr)
          output += (output ? "\n" : "") + "Error: " + response.data.stderr;
        if (response.data.compile_output)
          output +=
            (output ? "\n" : "") +
            "Compile Output: " +
            response.data.compile_output;
        if (response.data.message)
          output += (output ? "\n" : "") + "Message: " + response.data.message;

        setExecutionResult(output || "Execution finished with no output.");

        // If using Judge0, you might also want to check response.data.status.description
        // e.g. if (response.data.status && response.data.status.description !== "Accepted") { ... }
      } else {
        setExecutionResult(
          "Execution failed. No output or unexpected response format."
        );
      }
    } catch (err) {
      console.error("Error executing code:", err);
      if (err.response && err.response.data) {
        setExecutionResult(
          `Error: ${
            err.response.data.error || JSON.stringify(err.response.data)
          }`
        );
      } else {
        setExecutionResult(`Error executing code: ${err.message}`);
      }
    }
  };

  useEffect(() => {
    const socket = io(url, { query: { token } });
    socketRef.current = socket;
    const userId = localStorage.getItem("userId") || "guest";

    if (documentId) {
      socket.emit("join-document", documentId, userId);
    }

    socket.on("load-document", (data) => {
      setCode(data);
    });

    socket.on("receive-changes", (_, remoteCode) => {
      // Only update if the code is actually different to avoid potential cursor jumps or re-renders.
      // Monaco handles its own state well, so this needs to be managed carefully for collaborative editing.
      // You might need a more sophisticated way to merge changes or handle cursor positions
      // if multiple users are editing rapidly.
      if (editorRef.current && remoteCode !== editorRef.current.getValue()) {
        // Preserve cursor/selection if possible, though this is a complex problem
        const currentSelection = editorRef.current.getSelection();
        setCode(remoteCode); // Update local state
        editorRef.current.setValue(remoteCode); // Directly set value in Monaco
        if (currentSelection) editorRef.current.setSelection(currentSelection);
      }
    });

    return () => socket.disconnect();
  }, [documentId, token, url]); // Removed 'code' from dependencies to avoid re-connecting on local code changes

  useEffect(() => {
    const interval = setInterval(() => {
      if (code && documentId) saveDocument(code); // only save if there's a documentId
    }, SAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [code, saveDocument, documentId]);

  const handleNavigate = (path) => {
    if (code && documentId && !isSaving) {
      // only save if there's a documentId
      saveDocument(code).then(() => navigate(path));
    } else {
      navigate(path);
    }
  };

  return (
    <div
      className="flex flex-col bg-[#1e1e1e] text-white mt-16"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      {" "}
      {/* Main container takes full viewport height below assumed 4rem navbar */}
      {/* Top Bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-[#333333] border-b border-[#444444] flex-shrink-0">
        <div className="flex items-center gap-x-2">
          {/* Replaced "Back to Dashboard" with "File", "Help" like in image */}
          {/* You can make these actual dropdown menus later */}
          <button
            onClick={() => handleNavigate("/dashboard")}
            className="px-2 py-1 text-sm text-gray-300 hover:bg-[#4f4f4f] rounded"
          >
            {/* Using a simple back arrow, you can use an SVG icon too */}
            &#x2190; Dashboard
          </button>
          <button className="px-2 py-1 text-sm text-gray-300 hover:bg-[#4f4f4f] rounded">
            File
          </button>
          <button className="px-2 py-1 text-sm text-gray-300 hover:bg-[#4f4f4f] rounded">
            Help
          </button>
          <select
            className="bg-[#3c3c3c] border border-[#555555] text-sm text-gray-200 px-2 py-1 rounded focus:outline-none focus:border-[#007acc]"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++ (GCC 9.2.0)</option>
            <option value="java">Java (OpenJDK 13.0.1)</option>
            <option value="c">C (GCC 9.2.0)</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go</option>
            <option value="ruby">Ruby</option>
          </select>
          {/* Placeholders for other top bar items from the image */}
          <button className="px-2 py-1 text-sm text-gray-400 hover:text-white hidden md:inline">
            Compiler options
          </button>
          <button className="px-2 py-1 text-sm text-gray-400 hover:text-white hidden md:inline">
            Command line arguments
          </button>
        </div>
        <div className="flex items-center gap-x-2">
          <button
            onClick={executeCode}
            className="bg-[#007acc] hover:bg-[#005f99] text-white text-sm px-3 py-1 rounded flex items-center gap-x-1.5"
            disabled={isSaving}
          >
            <PlayIcon />
            Run Code
          </button>
          <button className="p-1.5 text-gray-300 hover:bg-[#4f4f4f] rounded hidden sm:inline">
            <MoonIcon /> {/* Placeholder for Theme Toggle */}
          </button>
          <button className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 text-white rounded hidden sm:inline">
            Sign in
          </button>{" "}
          {/* Placeholder */}
        </div>
      </div>
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {" "}
        {/* This row takes remaining height and handles overflow */}
        {/* Left Column: Editor + Output Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {" "}
          {/* This column takes available width */}
          {/* Editor */}
          <div className="flex-1 relative">
            {" "}
            {/* Monaco editor takes all available space in this part of the column */}
            <MonacoEditor
              height="100%" // Critical: Monaco fills its parent div
              defaultLanguage={language} // Set once
              language={language} // Can be changed dynamically
              theme="vs-dark" // VS Code dark theme
              value={code}
              onChange={(val) => {
                setCode(val || ""); // Ensure val is not undefined
                if (socketRef.current && documentId) {
                  const userId = localStorage.getItem("userId") || "guest";
                  socketRef.current.emit(
                    "text-change",
                    documentId,
                    userId,
                    val
                  );
                }
              }}
              onMount={handleEditorDidMount}
              options={{
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: "line",
                automaticLayout: true, // Essential for responsiveness and layout changes
                glyphMargin: true,
                minimap: { enabled: true, scale: 1 }, // Minimap as in image
                fontSize: 14,
                wordWrap: "on", // Optional: word wrapping
                scrollBeyondLastLine: false,
                padding: { top: 10, bottom: 10 },
              }}
            />
          </div>
          {/* Execution Output Panel (Terminal-like) */}
          {executionResult !== null && ( // Show if there's any result (even empty string) or error
            <div className="h-[200px] flex-shrink-0 bg-[#181818] border-t-2 border-[#007acc] p-0 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center px-3 py-1.5 bg-[#252526] border-b border-[#333333] flex-shrink-0">
                <h3 className="text-xs text-gray-300 uppercase tracking-wider font-semibold">
                  Output
                </h3>
                <button
                  onClick={() => setExecutionResult(null)}
                  className="text-gray-400 hover:text-white text-xs px-2 py-0.5 rounded hover:bg-[#4f4f4f]"
                  title="Clear Output"
                >
                  &#x2715; {/* Clear icon (simple X) */}
                </button>
              </div>
              <pre className="whitespace-pre-wrap p-3 text-sm text-gray-200 overflow-y-auto flex-1 font-mono bg-[#1e1e1e]">
                {executionResult}
              </pre>
            </div>
          )}
        </div>
        {/* AI Assistant Side Panel */}
        {isAISideChatOpen && (
          <div className="w-[300px] lg:w-[350px] bg-[#252526] border-l border-[#333333] flex flex-col flex-shrink-0 overflow-hidden">
            {/* AI Assistant Header */}
            <div className="p-3 border-b border-[#444444] flex items-center justify-between flex-shrink-0">
              <h2 className="text-sm font-semibold text-gray-200">
                AI Assistant
              </h2>
              <button
                onClick={() => setIsAISideChatOpen(false)}
                className="text-gray-400 hover:text-white"
                title="Close AI Assistant"
              >
                &#x2715; {/* Close icon */}
              </button>
            </div>
            {/* AI Chat Content - Make sure AISideChat is designed to fit here */}
            <div className="flex-1 overflow-y-auto">
              <AISideChat
                selectedText={selectedText}
                onApply={handleApplyAIResponse}
                setIsAISideChatOpen={setIsAISideChatOpen} // To allow AISideChat to close itself
              />
            </div>
            {/* Example Chat Input Area - if your AISideChat doesn't include one styled like this */}
            <div className="p-2 border-t border-[#444444] flex-shrink-0">
              <input
                type="text"
                placeholder="Ask AI or type / for commands..."
                className="w-full p-2 bg-[#3c3c3c] border border-[#555555] rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]"
              />
            </div>
          </div>
        )}
      </div>
      {/* Status Bar */}
      <div className="bg-[#007acc] text-white text-xs px-3 py-1 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-x-3">
          {documentId && (
            <span className="italic">
              Document ID: <span className="font-mono">{documentId}</span>
            </span>
          )}
          {!documentId && <span className="italic">Unsaved Document</span>}
        </div>
        <div className="flex items-center gap-x-3">
          {isSaving && <span className="animate-pulse">💾 Saving...</span>}
          {/* Add other status items like line/col if you extract them from Monaco */}
          <span className="hidden sm:inline">Ln ?, Col ?</span>
          <span className="uppercase">{language}</span>
          <span className="hidden sm:inline">UTF-8</span>
          <span className="hidden sm:inline">Spaces: 2</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
