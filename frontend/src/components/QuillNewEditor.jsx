import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { debounce, throttle } from "lodash";
import AISideChat from "./AiSideChat";
import { AppContext } from "../context/AppContext";

const SAVE_INTERVAL_MS = 3000;
const DEBOUNCE_DELAY = 100;
const THROTTLE_INTERVAL = 200;

function QuillNewEditor() {
  const { url } = useContext(AppContext);
  const { id: documentId } = useParams();
  //const [content, setContent] = useState({ ops: [{ insert: "\n" }] });
  const [content, setContent] = useState("");
  const quillRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [isAISideChatOpen, setIsAISideChatOpen] = useState(true);
  const [selectedText, setSelectedText] = useState("");
  const [isSaving, setIsSaving] = useState(false); // Add a state to track saving status

  //const url = "https://collabsphere-realtime-collaboration.onrender.com"

  // --- Helper function to save the document ---
  const saveDocument = useCallback(
    async (contentToSave) => {
      if (!documentId) return;
      setIsSaving(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token not found.  Not saving.");
          setIsSaving(false);
          return;
        }

        const response = await fetch(`${url}/api/documents/${documentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: contentToSave }), // Send the HTML content
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            "Failed to save document:",
            errorData.message || "Unknown error"
          );
        } else {
          console.log("Document saved successfully.");
        }
      } catch (error) {
        console.error("Error saving document:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [documentId, url]
  );

  const handleTextSelection = useCallback(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range && range.length > 0) {
        setSelectedText(editor.getText(range.index, range.length));
        setIsAISideChatOpen(true); // Open the side chat when text is selected
      } else {
        setSelectedText("");
        //  setIsAISideChatOpen(false); // Close if no text is selected
      }
    }
  }, []);

  // const handleApplyAIResponse = (newText) => {
  //   if (quillRef.current && selectedText) {
  //     const editor = quillRef.current?.getEditor();
  //     const range = editor.getSelection();
  //     if (range) {
  //       editor.replaceText(range.index, range.length, newText);
  //     } else {
  //       editor.insertText(editor.getLength() - 1, newText); // If no selection, insert at the end
  //     }
  //   }
  //   //setIsAISideChatOpen(false); // Close the side chat after applying
  //   setSelectedText("");
  // };

  const handleApplyAIResponse = (newText) => {
    if (!quillRef.current || !selectedText) return;
  
    const editor = quillRef.current.getEditor?.();
    if (!editor || typeof editor.insertText !== 'function') {
      console.error('Quill editor instance not found or insertText is not a function');
      return;
    }
  
    const range = editor.getSelection();
    if (range) {
      editor.deleteText(range.index, range.length); // Remove selected text
      editor.insertText(range.index, newText);      // Insert new text at same position
    } else {
      editor.insertText(editor.getLength() - 1, newText); // Append at end
    }
  
    setSelectedText('');
  };
  

  

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.on("selection-change", handleTextSelection);
    }

    return () => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        editor.off("selection-change", handleTextSelection);
      }
    };
  }, [handleTextSelection]);

  useEffect(() => {
    if (!socketRef.current) {
      const token = localStorage.getItem("token");
      const socket = io(url, {
        query: { token: token },
      });
      socketRef.current = socket;
    }

    if (documentId) {
      const userId = localStorage.getItem("userId") || "guest";
      socketRef.current.emit("join-document", documentId, userId);
      //console.log(`Joined document room: ${documentId} as user: ${userId}`);
    }

    socketRef.current.on("receive-changes", (remoteUserId, delta) => {
      //console.log(`Received changes from ${remoteUserId}:`, delta);
      if (quillRef.current) {
        quillRef.current.getEditor().updateContents(delta);
      }
    });

    socketRef.current.on("load-document", (initialContent) => {
      if (initialContent) {
        setContent(initialContent);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [documentId, navigate]);

  const handleChange = useCallback(
    (newContent, delta, source, editor) => {
      setContent(newContent);
      if (source === "user" && socketRef.current) {
        socketRef.current.emit(
          "text-change",
          documentId,
          localStorage.getItem("userId") || "guest",
          delta
        );
      }
    },
    [documentId]
  );

  const debouncedSendChanges = useCallback(
    debounce((documentId, userId, delta) => {
      if (socketRef.current) {
        socketRef.current.emit("text-change", documentId, userId, delta);
      }
    }, DEBOUNCE_DELAY),
    []
  );

  const throttledSendChanges = useCallback(
    throttle(
      (documentId, userId, delta) => {
        if (socketRef.current) {
          socketRef.current.emit("text-change", documentId, userId, delta);
        }
      },
      100,
      { leading: true, trailing: true }
    ), // Adjust as needed
    []
  );

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // Added headers 3-6
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "checked" }], // Added checked list
      [{ indent: "-1" }, { indent: "+1" }], // Added indent options
      [{ script: "sub" }, { script: "super" }], // Added subscript/superscript
      [{ direction: "rtl" }], // Added right-to-left text direction
      [{ size: ["small", false, "large", "huge"] }], // Added size options
      [{ color: [] }, { background: [] }], // Added color and background color
      [{ font: [] }], // Added font selection
      [{ align: [] }], // Added text alignment options
      ["blockquote", "code-block"], // Keep blockquote and code-block
      ["link", "image", "video", "formula"], // Added formula
    ],
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 100,
      maxStack: 200,
      userOnly: true,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "indent",
    "script",
    "direction",
    "size",
    "color",
    "background",
    "font",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
    "formula",
  ];

  const themeClasses = {
    light: {
      container: "bg-[#fefefe] rounded-xl shadow-xl p-6 border border-gray-200",
      toolbar: "bg-[#f9f9f9] border-b border-gray-300",
      toolbarButton:
        "bg-white hover:bg-gray-100 text-gray-800 font-medium px-4 py-2 rounded-lg shadow-sm transition",
      editor: "h-[500px] bg-white text-gray-900 p-4 rounded-b-xl",
      closeButton: "text-gray-600 hover:text-gray-900 transition font-medium",
    },
    dark: {
      container: "bg-[#1e1e1e] rounded-xl shadow-xl p-6 border border-gray-700",
      toolbar: "bg-[#2a2a2a] border-b border-gray-600",
      toolbarButton:
        "bg-[#333] hover:bg-[#444] text-gray-100 font-medium px-4 py-2 rounded-lg shadow-sm transition",
      editor: "h-[500px] bg-[#1e1e1e] text-gray-100 p-4 rounded-b-xl",
      closeButton: "text-gray-300 hover:text-white transition font-medium",
    },
  };

  // --- Auto-save effect ---
  useEffect(() => {
    let saveInterval;

    if (documentId) {
      saveInterval = setInterval(() => {
        if (content) {
          //  Check if content exists
          saveDocument(content);
        }
      }, SAVE_INTERVAL_MS);
    }

    return () => {
      clearInterval(saveInterval);
    };
  }, [documentId, content, saveDocument]);

  // --- Save before unload ---
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (content) {
        event.preventDefault();
        event.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        saveDocument(content).then(() => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
           // No navigation here, just allow unload
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [content, saveDocument]);

  const handleNavigate = (path) => {
    if (content && !isSaving) {
      saveDocument(content).then(() => {
        navigate(path);
      });
    } else {
      navigate(path);
    }
  };


  return (
    <div className="min-h-screen mt-10 flex bg-gradient-to-b from-[#ece9e6] to-[#ffffff] dark:from-[#111] dark:to-gray-900 transition-all duration-300 py-12 px-4">
      <div className="relative w-full flex">
        {" "}
        {/* Make this a flex container */}
        <div className="flex-1 mr-4">
          {" "}
          {/* Editor takes up most of the space */}
          <div className={`pb-20 mb-8 ${themeClasses[theme].container}`}>
            <div className="flex justify-between items-center mb-4">
            <button
                onClick={() => handleNavigate("/dashboard")}
                className={themeClasses[theme].closeButton}
              >
                ⬅ Back to Dashboard
              </button>
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className={themeClasses[theme].toolbarButton}
              >
                {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </button>
            </div>

            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              className={`${themeClasses[theme].editor}`}
              onSelectionChange={handleTextSelection} // Listen for selection changes
            />
          </div>
          {documentId && (
            <p className="text-sm text-right text-gray-500 mt-2 italic">
              Document ID: <span className="font-mono">{documentId}</span>
              {isSaving && <span className="ml-4">Saving...</span>}
            </p>
          )}
        </div>
        {isAISideChatOpen && (
          <AISideChat
            selectedText={selectedText}
            onApply={handleApplyAIResponse}
            setIsAISideChatOpen={setIsAISideChatOpen}
          />
        )}
      </div>
    </div>
  );
}

export default QuillNewEditor;
