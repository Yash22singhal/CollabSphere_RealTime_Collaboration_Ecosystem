// import React, {
//   useEffect,
//   useRef,
//   useState,
//   useContext,
//   useCallback,
// } from "react";
// import MonacoEditor from "@monaco-editor/react";
// import { useParams, useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
// import { AppContext } from "../context/AppContext";
// import AISideChat from "./AiSideChat";
// import axios from "axios";

// const SAVE_INTERVAL_MS = 3000;

// const CodeEditor = () => {
//   const { id: documentId } = useParams();
//   const { url, token } = useContext(AppContext);
//   const [code, setCode] = useState("// Start coding here...");
//   const [language, setLanguage] = useState("javascript");
//   const [isAISideChatOpen, setIsAISideChatOpen] = useState(true);
//   const [selectedText, setSelectedText] = useState("");
//   const [isSaving, setIsSaving] = useState(false);
//   const [executionResult, setExecutionResult] = useState(null); // Store the execution result
//   const editorRef = useRef(null);
//   const socketRef = useRef(null);
//   const navigate = useNavigate();

//   const saveDocument = useCallback(
//     async (codeToSave) => {
//       if (!documentId) return;
//       setIsSaving(true);
//       try {
//         await fetch(`${url}/api/documents/${documentId}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ content: codeToSave }),
//         });
//       } catch (err) {
//         console.error("Error saving document:", err);
//       } finally {
//         setIsSaving(false);
//       }
//     },
//     [documentId, token, url]
//   );

//   const handleEditorDidMount = (editor) => {
//     editorRef.current = editor;
//     editor.onDidChangeCursorSelection((e) => {
//       const selected = editor.getModel().getValueInRange(e.selection);
//       setSelectedText(selected);
//       // /setIsAISideChatOpen(!!selected);
//     });
//   };

//   const handleApplyAIResponse = (newText) => {
//     const editor = editorRef.current;
//     if (!editor || !selectedText) return;
//     const selection = editor.getSelection();
//     editor.executeEdits(null, [
//       {
//         range: selection,
//         text: newText,
//         forceMoveMarkers: true,
//       },
//     ]);
//     setSelectedText("");
//     setIsAISideChatOpen(false);
//   };

//   const executeCode = async () => {
//     try {
//       const response = await axios.post(`${url}/api/code/execute`, {
//         source_code: code,
//         language_id: getLanguageId(language),
//         stdin: "",
//       });

//       if (response.data && response.data.output) {
//         setExecutionResult(response.data.output);
//       } else {
//         setExecutionResult("Execution failed. No output.");
//       }
//     } catch (err) {
//       setExecutionResult("Error executing code.");
//       console.error("Error executing code:", err);
//     }
//   };

//   const getLanguageId = (lang) => {
//     switch (lang) {
//       case "javascript":
//         return 63; // JavaScript (Node.js)
//       case "python":
//         return 71; // Python (3.x)
//       case "cpp":
//         return 54; // C++ (GCC 9.2.0)
//       case "java":
//         return 62; // Java (OpenJDK 13.0.1)
//       case "c":
//         return 50; // C (GCC 9.2.0)
//       case "typescript":
//         return 74; // TypeScript
//       case "go":
//         return 60; // Go (1.13.1)
//       case "ruby":
//         return 72; // Ruby
//       default:
//         return 63; // Default to JavaScript
//     }
//   };

//   useEffect(() => {
//     const socket = io(url, { query: { token } });
//     socketRef.current = socket;
//     const userId = localStorage.getItem("userId") || "guest";

//     if (documentId) {
//       socket.emit("join-document", documentId, userId);
//     }

//     socket.on("load-document", (data) => {
//       setCode(data);
//     });

//     socket.on("receive-changes", (_, remoteCode) => {
//       if (remoteCode !== code) {
//         setCode(remoteCode);
//       }
//     });

//     return () => socket.disconnect();
//   }, [documentId, token, url]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (code) saveDocument(code);
//     }, SAVE_INTERVAL_MS);
//     return () => clearInterval(interval);
//   }, [code, saveDocument]);

//   const handleNavigate = (path) => {
//     if (code && !isSaving) {
//       saveDocument(code).then(() => navigate(path));
//     } else {
//       navigate(path);
//     }
//   };

//   return (
//     // <div className="min-h-screen p-4 mt-16 bg-gray-100 dark:bg-[#1a1a1a] text-black dark:text-white">
//     //   <div className="flex justify-between mb-2">
//     //     <button
//     //       onClick={() => handleNavigate("/dashboard")}
//     //       className="text-blue-500 dark:text-blue-400"
//     //     >
//     //       ⬅ Back to Dashboard
//     //     </button>
//     //     {/* <select
//     //         className="bg-white dark:bg-[#2c2c2c] border p-1 rounded"
//     //         value={language}
//     //         onChange={(e) => setLanguage(e.target.value)}
//     //         >
//     //         <option value="javascript">JavaScript</option>
//     //         <option value="python">Python</option>
//     //         <option value="cpp">C++</option>
//     //         <option value="java">Java</option>
//     //         </select> */}
//     //     <select
//     //       className="bg-white dark:bg-[#2c2c2c] border p-1 rounded"
//     //       value={language}
//     //       onChange={(e) => setLanguage(e.target.value)}
//     //     >
//     //       <option value="javascript">JavaScript</option>
//     //       <option value="python">Python</option>
//     //       <option value="cpp">C++</option>
//     //       <option value="java">Java</option>
//     //       <option value="c">C</option>
//     //       <option value="typescript">TypeScript</option>
//     //       <option value="go">Go</option>
//     //       <option value="ruby">Ruby</option>
//     //     </select>

//     //     <button
//     //       onClick={executeCode}
//     //       className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
//     //     >
//     //       Run Code
//     //     </button>
//     //   </div>
//     //   <div className="flex flex-col lg:flex-row gap-4">
//     //     <div className="flex-1 h-[600px]">
//     //       <MonacoEditor
//     //         height="100%"
//     //         defaultLanguage={language}
//     //         language={language}
//     //         theme="vs-dark"
//     //         value={code}
//     //         onChange={(val) => {
//     //           setCode(val);
//     //           const userId = localStorage.getItem("userId") || "guest";
//     //           socketRef.current?.emit("text-change", documentId, userId, val);
//     //         }}
//     //         onMount={handleEditorDidMount}
//     //       />
//     //     </div>
//     //     {isAISideChatOpen && (
//     //       <div className="w-full lg:w-[300px]">
//     //         <AISideChat
//     //           selectedText={selectedText}
//     //           onApply={handleApplyAIResponse}
//     //           setIsAISideChatOpen={setIsAISideChatOpen}
//     //         />
//     //       </div>
//     //     )}
//     //   </div>
//     //   {documentId && (
//     //     <p className="text-sm text-right text-gray-500 mt-2 italic">
//     //       Document ID: <span className="font-mono">{documentId}</span>
//     //       {isSaving && <span className="ml-4">Saving...</span>}
//     //     </p>
//     //   )}
//     //   {executionResult && (
//     //     <div className="mt-4">
//     //       <h3 className="text-lg font-semibold">Execution Output:</h3>
//     //       <pre className="bg-gray-800 text-white p-4 rounded">
//     //         {executionResult}
//     //       </pre>
//     //     </div>
//     //   )}
//     // </div>

//     <div className="min-h-screen bg-[#1e1e1e] text-white code-editor-container mt-16">
//       {/* Top Bar */}
//       <div className="flex justify-between items-center px-4 py-2 bg-[#333] border-b border-[#444]">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => handleNavigate("/dashboard")}
//             className="text-sm text-blue-400 hover:text-blue-300"
//           >
//             ⬅ Dashboard
//           </button>
//           <select
//             className="bg-[#2d2d2d] border border-[#444] text-sm px-2 py-1 rounded text-white"
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//           >
//             <option value="javascript">JavaScript</option>
//             <option value="python">Python</option>
//             <option value="cpp">C++</option>
//             <option value="java">Java</option>
//             <option value="c">C</option>
//             <option value="typescript">TypeScript</option>
//             <option value="go">Go</option>
//             <option value="ruby">Ruby</option>
//           </select>
//         </div>
//         <button
//           onClick={executeCode}
//           className="bg-green-600 hover:bg-green-700 text-sm px-3 py-1 rounded"
//         >
//           ▶ Run
//         </button>
//       </div>

//       {/* Main Editor Area */}
//       <div className="flex flex-col lg:flex-row">
//         {/* Editor */}
//         <div className="flex-1 h-[calc(100vh-160px)] border-r border-[#333]">
//           <MonacoEditor
//             height="100%"
//             defaultLanguage={language}
//             language={language}
//             theme="vs-dark"
//             value={code}
//             onChange={(val) => {
//               setCode(val);
//               const userId = localStorage.getItem("userId") || "guest";
//               socketRef.current?.emit("text-change", documentId, userId, val);
//             }}
//             onMount={handleEditorDidMount}
//           />
//         </div>

//         {/* Side Chat */}
//         {isAISideChatOpen && (
//           <div className="w-full lg:w-[300px] bg-[#252526] border-l border-[#333]">
//             <AISideChat
//               selectedText={selectedText}
//               onApply={handleApplyAIResponse}
//               setIsAISideChatOpen={setIsAISideChatOpen}
//             />
//           </div>
//         )}
//       </div>

//       {/* Execution Output (like terminal) */}
//       {executionResult && (
//         <div className="bg-[#1e1e1e] border-t border-[#444] px-4 py-3 text-sm">
//           <h3 className="text-yellow-400 mb-1">🖥 Execution Output:</h3>
//           <pre className="bg-[#111] p-3 rounded overflow-auto max-h-[200px] text-green-400 font-mono whitespace-pre-wrap">
//             {executionResult}
//           </pre>
//         </div>
//       )}

//       {/* Status Bar */}
//       <div className="bg-[#007acc] text-white text-xs px-4 py-1 flex justify-between items-center">
//         <span className="italic">
//           {documentId && (
//             <>
//               Document ID: <span className="font-mono">{documentId}</span>
//             </>
//           )}
//         </span>
//         {isSaving && <span className="animate-pulse">💾 Saving...</span>}
//       </div>
//     </div>
//   );
// };

// export default CodeEditor;

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
import AISideChat from "./AiSideChat";
import axios from "axios";

const SAVE_INTERVAL_MS = 3000;

const CodeEditor = () => {
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
    setIsAISideChatOpen(false);
  };

  const executeCode = async () => {
    try {
      const response = await axios.post(`${url}/api/code/execute`, {
        source_code: code,
        language_id: getLanguageId(language),
        stdin: "",
      });

      if (response.data && response.data.output) {
        setExecutionResult(response.data.output);
      } else {
        setExecutionResult("Execution failed. No output.");
      }
    } catch (err) {
      setExecutionResult("Error executing code.");
      console.error("Error executing code:", err);
    }
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
      if (remoteCode !== code) {
        setCode(remoteCode);
      }
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
    // <div className="min-h-screen bg-[#1e1e1e] text-white code-editor-container mt-16">
    //   {/* Top Bar */}
    //   <div className="flex justify-between items-center px-4 py-2 bg-[#333] border-b border-[#444]">
    //     <div className="flex items-center gap-4">
    //       <button
    //         onClick={() => handleNavigate("/dashboard")}
    //         className="text-sm text-blue-400 hover:text-blue-300"
    //       >
    //         ⬅ Dashboard
    //       </button>
    //       <select
    //         className="bg-[#2d2d2d] border border-[#444] text-sm px-2 py-1 rounded text-white"
    //         value={language}
    //         onChange={(e) => setLanguage(e.target.value)}
    //       >
    //         <option value="javascript">JavaScript</option>
    //         <option value="python">Python</option>
    //         <option value="cpp">C++</option>
    //         <option value="java">Java</option>
    //         <option value="c">C</option>
    //         <option value="typescript">TypeScript</option>
    //         <option value="go">Go</option>
    //         <option value="ruby">Ruby</option>
    //       </select>
    //     </div>
    //     <button
    //       onClick={executeCode}
    //       className="bg-green-600 hover:bg-green-700 text-sm px-3 py-1 rounded"
    //     >
    //       ▶ Run
    //     </button>
    //   </div>

    //   {/* Editor and AI Chat */}
    //   <div className="flex flex-col lg:flex-row">
    //     <div className="flex-1 h-[calc(100vh-160px)]">
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
    //       />
    //     </div>

    //     {isAISideChatOpen && (
    //       <div className="w-full lg:w-[300px] border-l border-[#444] bg-[#2a2a2a]">
    //         <AISideChat
    //           selectedText={selectedText}
    //           onApply={handleApplyAIResponse}
    //           setIsAISideChatOpen={setIsAISideChatOpen}
    //         />
    //       </div>
    //     )}
    //   </div>

    //   {/* Footer Info */}
    //   {documentId && (
    //     <p className="text-sm text-right text-gray-400 mt-2 italic px-4">
    //       Document ID: <span className="font-mono">{documentId}</span>
    //       {isSaving && <span className="ml-4">Saving...</span>}
    //     </p>
    //   )}

    //   {/* Execution Result */}
    //   {executionResult && (
    //     <div className="mt-4 px-4">
    //       <h3 className="text-lg font-semibold mb-2">Execution Output:</h3>
    //       <pre className="bg-gray-800 text-white p-4 rounded">
    //         {executionResult}
    //       </pre>
    //     </div>
    //   )}
    // </div>

    <div className="min-h-screen bg-[#1e1e1e] text-white code-editor-container mt-16">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#333] border-b border-[#444]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavigate("/dashboard")}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ⬅ Dashboard
          </button>
          <select
            className="bg-[#2d2d2d] border border-[#444] text-sm px-2 py-1 rounded text-white"
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
        </div>
        <button
          onClick={executeCode}
          className="bg-green-600 hover:bg-green-700 text-sm px-3 py-1 rounded"
        >
          ▶ Run
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1">
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
          />
        </div>

        {/* Right Panel: AI Chat + Output */}
        {isAISideChatOpen && (
          <div className="w-full lg:w-[350px] bg-[#2a2a2a] flex flex-col border-l border-[#444]">
            <div className="flex-1 overflow-auto">
              <AISideChat
                selectedText={selectedText}
                onApply={handleApplyAIResponse}
                setIsAISideChatOpen={setIsAISideChatOpen}
              />
            </div>
            {executionResult && (
              <div className="max-h-[200px] overflow-y-auto bg-[#1e1e1e] border-t border-[#444] p-2 text-sm">
                <h3 className="text-base font-semibold text-green-400 mb-1">
                  Execution Output:
                </h3>
                <pre className="whitespace-pre-wrap text-gray-200">
                  {executionResult}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Optional: Document ID and saving indicator */}
      {documentId && (
        <p className="text-sm text-right text-gray-500 mt-2 italic px-4">
          Document ID: <span className="font-mono">{documentId}</span>
          {isSaving && <span className="ml-4">Saving...</span>}
        </p>
      )}
    </div>
  );
};

export default CodeEditor;
