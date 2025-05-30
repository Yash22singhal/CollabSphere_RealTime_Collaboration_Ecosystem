import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { marked } from "marked";
import "github-markdown-css/github-markdown.css";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import AISideChat from "./AiSideChat";
import { AppContext } from "../context/AppContext";
import DownloadToolbar from "./DownloadContent";
import ShareButton from "./ShareButton";
import ScrollToTopButton from "./ScrollToTopButton";

const SAVE_INTERVAL_MS = 3000;

function MarkdownEditor( {doc} ) {
  const { url } = useContext(AppContext);
  const { id: documentId } = useParams();
  const [content, setContent] = useState("");
  const [isAISideChatOpen, setIsAISideChatOpen] = useState(true);
  const [selectedText, setSelectedText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const textareaRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const saveDocument = useCallback(
    async (contentToSave) => {
      if (!documentId) return;
      setIsSaving(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        await fetch(`${url}/api/documents/${documentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: contentToSave }),
        });
      } catch (err) {
        console.error("Error saving document:", err);
      } finally {
        setIsSaving(false);
      }
    },
    [documentId, url]
  );

  const handleSelection = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end);
      setSelectedText(selected || "");
      setIsAISideChatOpen(!!selected);
    }
  };

  const handleApplyAIResponse = (newText) => {
    const textarea = textareaRef.current;
    if (!textarea || !selectedText) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const updatedContent =
      content.substring(0, start) + newText + content.substring(end);
    setContent(updatedContent);
    setSelectedText("");
    setIsAISideChatOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = io(url, { query: { token } });
    socketRef.current = socket;

    const userId = localStorage.getItem("userId") || "guest";

    if (documentId) {
      socket.emit("join-document", documentId, userId);
    }

    socket.on("load-document", (data) => {
      setContent(data);
    });

    socket.on("receive-changes", (_, remoteContent) => {
      if (remoteContent !== content) {
        setContent(remoteContent);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [documentId, url]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (content) saveDocument(content);
    }, SAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [content, saveDocument]);

  useEffect(() => {
    const handler = (e) => {
      if (content) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes.";
        saveDocument(content);
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [content, saveDocument]);

  const markdownPreview = marked.parse(content || "");

  const handleNavigate = (path) => {
    if (content && !isSaving) {
      saveDocument(content).then(() => navigate(path));
    } else {
      navigate(path);
    }
  };

  return (
        <div className="min-h-screen px-4 sm:px-6 md:px-8 py-6 mt-16 bg-gray-100 dark:bg-[#1a1a1a] text-black dark:text-white transition">
  <div className="flex flex-col lg:flex-row gap-6">
    {/* Left Section (Editor + Preview) */}
    <div className="flex-1 w-full">
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4 sticky top-0 z-10 bg-gray-100 dark:bg-[#1a1a1a] py-2 px-1 sm:px-0">
        <button
          onClick={() => handleNavigate("/dashboard")}
          className="text-blue-500 dark:text-blue-400 font-medium hover:underline"
        >
          ⬅ Back to Dashboard
        </button>
        <div className="flex gap-5">
        <DownloadToolbar content={content} type="markdown" fileName={doc.title} />
        <ShareButton url={window.location.href} />
        </div>
      </div>
      {/* Markdown Editor */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
          const newContent = e.target.value;
          setContent(newContent);
          const userId = localStorage.getItem("userId") || "guest";
          socketRef.current?.emit("text-change", documentId, userId, newContent);
        }}
        onMouseUp={handleSelection}
        onKeyUp={handleSelection}
        className="w-full min-h-[200px] sm:h-64 p-4 rounded-lg shadow-sm resize-y bg-white dark:bg-[#121212] text-black dark:text-white border border-gray-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your markdown here..."
      />
      {/* Preview */}
      <div className="markdown-body bg-white dark:bg-[#121212] mt-6 p-4 rounded-lg max-h-[70vh] overflow-auto border border-gray-200 dark:border-white/10">
        <h3 className="text-xl font-semibold mb-2">Preview</h3>
        <div dangerouslySetInnerHTML={{ __html: markdownPreview }} />
      </div>
    </div>
    {/* Right Section (AI Side Chat) */}
    {isAISideChatOpen && (
      <div className="w-full lg:max-w-sm">
        <AISideChat
          selectedText={selectedText}
          onApply={handleApplyAIResponse}
          setIsAISideChatOpen={setIsAISideChatOpen}
        />
      </div>
    )}
  </div>
  {/* Document ID */}
  {documentId && (
    <p className="text-sm text-right text-gray-500 mt-4 italic">
      Document ID: <span className="font-mono">{documentId}</span>
      {isSaving && <span className="ml-4 animate-pulse">Saving...</span>}
    </p>
  )}
  <ScrollToTopButton />
</div>);}
export default MarkdownEditor;
