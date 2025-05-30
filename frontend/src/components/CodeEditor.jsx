import React, { useEffect, useRef, useState, useContext, useCallback } from "react";
import MonacoEditor from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { AppContext } from "../context/AppContext";
import AISideChat from "./AiSideChat";
import axios from "axios";
import DownloadToolbar from "./DownloadContent";
import ShareButton from "./ShareButton";
import ScrollToTopButton from "./ScrollToTopButton";

const SAVE_INTERVAL_MS = 3000;

const CodeEditor = ( {doc} ) => {
  const { id: documentId } = useParams();
  const { url, token } = useContext(AppContext);
  const [code, setCode] = useState("// Start coding here...");
  const [language, setLanguage] = useState("javascript");
  const [isAISideChatOpen, setIsAISideChatOpen] = useState(true);
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
      setIsAISideChatOpen(true);
    });
  };

  const handleApplyAIResponse = (newText) => {
    const editor = editorRef.current;
    if (!editor || !selectedText) return;
    const selection = editor.getSelection();
    editor.executeEdits(null, [
      {
        range: selection,
        text: newText,
        forceMoveMarkers: true,
      },
    ]);
    setSelectedText("");
  };

  const executeCode = async () => {
    try {
      const response = await axios.post(`${url}/api/code/execute`, {
        source_code: code,
        language_id: getLanguageId(language),
        stdin: "",
      });

      setExecutionResult(response.data?.output || "Execution failed. No output.");
    } catch (err) {
      setExecutionResult("Error executing code.");
      console.error("Error executing code:", err);
    }
  };

  const getLanguageId = (lang) => {
    switch (lang) {
      case "javascript": return 63;
      case "python": return 71;
      case "cpp": return 54;
      case "java": return 62;
      case "c": return 50;
      case "typescript": return 74;
      case "go": return 60;
      case "ruby": return 72;
      default: return 63;
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
      if (remoteCode !== code) setCode(remoteCode);
    });

    // Listening for changes in collaborators' cursor positions
    socket.on("active-collaborators", (users) => {
      setActiveUsers(users);
    });

    return () => socket.disconnect();
  }, [documentId, token, url]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (code) saveDocument(code);
    }, SAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [code, saveDocument]);

  const handleNavigate = (path) => {
    if (code && !isSaving) {
      saveDocument(code).then(() => navigate(path));
    } else {
      navigate(path);
    }
  };

  return (
    // <div className="min-h-screen bg-[#1e1e1e] text-white code-editor-container my-20 mx-5 border-4 border-gray-500">
    //   <div className="flex justify-between items-center px-6 py-3 bg-gradient-to-r from-[#2b2b2b] via-[#333] to-[#2b2b2b] border-b border-[#555] shadow-md">
    //     <div className="flex items-center justify-center gap-6">
    //       <button
    //         onClick={() => handleNavigate("/dashboard")}
    //         className="flex items-center gap-1 text-lg text-gray-200 hover:text-blue-300 transition duration-200"
    //       >
    //         <span className="text-lg">⬅</span> Dashboard
    //       </button>

    //       <div className="relative">
    //         <select
    //           className="bg-[#1e1e1e] border border-[#555] text-sm px-3 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none pr-8"
    //           value={language}
    //           onChange={(e) => setLanguage(e.target.value)}
    //         >
    //           <option value="javascript">JavaScript</option>
    //           <option value="python">Python</option>
    //           <option value="cpp">C++</option>
    //           <option value="java">Java</option>
    //           <option value="c">C</option>
    //           <option value="typescript">TypeScript</option>
    //           <option value="go">Go</option>
    //           <option value="ruby">Ruby</option>
    //         </select>
    //         <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-gray-400">
    //           ▼
    //         </div>
    //       </div>
          
    //     </div>

    //     <div className="flex gap-8 items-center">
    //       <DownloadToolbar content={code} type="code" fileName={doc.title} language={language} />
    //       <ShareButton url={window.location.href} />
    //     <button
    //       onClick={executeCode}
    //       className="flex items-center gap-1 bg-green-600 hover:bg-green-500 active:bg-green-700 text-md px-5 py-2 rounded-md font-medium shadow hover:shadow-lg transition duration-200"
    //     >
    //       ▶ Run Code
    //     </button>
    //     </div>
    //   </div>

    //   <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-64px)] p-5">
    //     <div className="w-full lg:w-2/3 flex-1 border-4 border-gray-500">
    //       <MonacoEditor
    //         height="100%"
    //         defaultLanguage={language}
    //         language={language}
    //         theme="vs-dark"
    //         value={code}
    //         onChange={(val) => {
    //           setCode(val);
    //           const userId = localStorage.getItem("userId") || "guest";
    //           socketRef.current?.emit("text-change", documentId, userId, val);
    //         }}
    //         onMount={handleEditorDidMount}
    //         options={{
    //           cursorBlinking: "smooth", // Smooth cursor blinking
    //           renderLineHighlight: "gutter", // Gutter highlighting for the active line
    //         }}
    //         //onMount={handleEditorDidMount}
    //       />
    //     </div>

    //     <div className="flex flex-col gap-2 w-full lg:w-1/3 mt-4 lg:mt-0">
    //       {isAISideChatOpen && (
    //         <div className="max-h-[55vh] overflow-y-auto border-4 border-gray-500">
    //           <AISideChat
    //             selectedText={selectedText}
    //             onApply={handleApplyAIResponse}
    //             setIsAISideChatOpen={setIsAISideChatOpen}
    //           />
    //         </div>
    //       )}
    //       <div className="min-h-[200px] overflow-y-auto bg-[#1e1e1e] p-2 text-sm border-4 border-gray-500">
    //         <h3 className="text-base font-semibold text-green-400 mb-1">
    //           Execution Output:
    //         </h3>
    //         <pre className="whitespace-pre-wrap text-gray-200">
    //           {executionResult}
    //         </pre>
    //       </div>
    //     </div>
    //   </div>
    //   <ScrollToTopButton />
    // </div>

  <div className="min-h-screen bg-[#1e1e1e] text-white code-editor-container my-16 mx-3 sm:mx-4 md:mx-5 border-4 border-gray-500">
    {/* Top Toolbar */}
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 items-start sm:items-center px-4 py-3 bg-gradient-to-r from-[#2b2b2b] via-[#333] to-[#2b2b2b] border-b border-[#555] shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <button
          onClick={() => handleNavigate("/dashboard")}
          className="flex items-center gap-1 text-lg text-gray-200 hover:text-blue-300 transition duration-200"
        >
          <span className="text-lg">⬅</span> Dashboard
        </button>

        <div className="relative w-full sm:w-auto">
          <select
            className="w-full sm:w-auto bg-[#1e1e1e] border border-[#555] text-sm px-3 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none pr-8"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go</option>
            <option value="ruby">Ruby</option>
          </select>
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <DownloadToolbar content={code} type="code" fileName={doc.title} language={language} />
        <ShareButton url={window.location.href} />
        <button
          onClick={executeCode}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-500 active:bg-green-700 text-md px-5 py-2 rounded-md font-medium shadow hover:shadow-lg transition"
        >
          ▶ Run Code
        </button>
      </div>
    </div>

    {/* Editor and Sidebar */}
    <div className="flex flex-col lg:flex-row gap-4 flex-grow p-4">
      {/* Editor */}
      <div className="w-full lg:w-2/3 h-[400px] sm:min-h-[500px] lg:h-auto flex-1 border-4 border-gray-500">
        <MonacoEditor
          height="100%"
          defaultLanguage={language}
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(val) => {
            setCode(val);
            const userId = localStorage.getItem("userId") || "guest";
            socketRef.current?.emit("text-change", documentId, userId, val);
          }}
          onMount={handleEditorDidMount}
          options={{
            cursorBlinking: "smooth",
            renderLineHighlight: "gutter",
          }}
        />
      </div>

      {/* AI Chat + Output */}
      <div className="flex flex-col gap-4 w-full lg:w-1/3">
        {isAISideChatOpen && (
          <div className="max-h-[300px] sm:max-h-[400px] lg:max-h-[55vh] overflow-y-auto border-4 border-gray-500">
            <AISideChat
              selectedText={selectedText}
              onApply={handleApplyAIResponse}
              setIsAISideChatOpen={setIsAISideChatOpen}
            />
          </div>
        )}
        <div className="min-h-[180px] overflow-y-auto bg-[#1e1e1e] p-2 text-sm border-4 border-gray-500">
          <h3 className="text-base font-semibold text-green-400 mb-1">Execution Output:</h3>
          <pre className="whitespace-pre-wrap text-gray-200">{executionResult}</pre>
        </div>
      </div>
    </div>

    <ScrollToTopButton />
  </div>
);
}

export default CodeEditor;