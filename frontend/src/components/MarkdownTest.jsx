import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {marked} from "marked";  // For markdown parsing
import { AppContext } from "../context/AppContext";
import 'github-markdown-css/github-markdown.css';


const SAVE_INTERVAL_MS = 3000;

function MarkdownTest() {
  const { url } = useContext(AppContext);
  const { id: documentId } = useParams();
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const saveDocument = useCallback(
    async (contentToSave) => {
      if (!documentId) return;
      setIsSaving(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token not found. Not saving.");
          setIsSaving(false);
          return;
        }

        const response = await fetch(`${url}/api/documents/${documentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: contentToSave }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to save document:", errorData.message || "Unknown error");
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

  useEffect(() => {
    if (!socketRef.current) {
      const token = localStorage.getItem("token");
      const socket = io(url, { query: { token: token } });
      socketRef.current = socket;
    }

    if (documentId) {
      const userId = localStorage.getItem("userId") || "guest";
      socketRef.current.emit("join-document", documentId, userId);
    }

    socketRef.current.on("receive-changes", (remoteUserId, delta) => {
      if (delta) {
        setContent((prevContent) => prevContent + delta);  // Update content with incoming changes
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
  }, [documentId, url]);

  const handleChange = (e) => {
    setContent(e.target.value);
    if (socketRef.current) {
      socketRef.current.emit("text-change", documentId, localStorage.getItem("userId") || "guest", e.target.value);
    }
  };

  const handleSave = () => {
    if (content) {
      saveDocument(content);
    }
  };

  // Auto-save effect
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveDocument(content);
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(saveInterval);
    };
  }, [content, saveDocument]);

  const markdownPreview = marked(content);  // Convert markdown to HTML for preview

  return (
    <div className="markdown-editor mt-20">
      <div className="editor-container">
        <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Write your markdown content here..."
          className="markdown-textarea"
        />
      </div>
      <div className="markdown-preview markdown-body">
        <h3>Preview</h3>
        <div dangerouslySetInnerHTML={{ __html: markdownPreview }} />
        
    </div>
      {documentId && (
        <p className="text-sm text-right text-gray-500 mt-2 italic">
          Document ID: <span className="font-mono">{documentId}</span>
          {isSaving && <span className="ml-4">Saving...</span>}
        </p>
      )}
    </div>
  );
}

export default MarkdownTest;