import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { debounce, throttle } from 'lodash';
import AISideChat from './AiSideChat';

const SAVE_INTERVAL_MS = 2000;
const DEBOUNCE_DELAY = 100;
const THROTTLE_INTERVAL = 200;

function QuillNewEditor() {
  const { id: documentId } = useParams();
  const [content, setContent] = useState({ ops: [{ insert: '\n' }] });
  const quillRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [isAISideChatOpen, setIsAISideChatOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  

  const handleTextSelection = useCallback(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range && range.length > 0) {
        setSelectedText(editor.getText(range.index, range.length));
        setIsAISideChatOpen(true); // Open the side chat when text is selected
      } else {
        setSelectedText('');
        setIsAISideChatOpen(false); // Close if no text is selected
      }
    }
  }, []);

  const handleApplyAIResponse = (newText) => {
    if (quillRef.current && selectedText) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        editor.replaceText(range.index, range.length, newText);
      } else {
        editor.insertText(editor.getLength() - 1, newText); // If no selection, insert at the end
      }
    }
    setIsAISideChatOpen(false); // Close the side chat after applying
    setSelectedText('');
  };

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.on('selection-change', handleTextSelection);
    }

    return () => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        editor.off('selection-change', handleTextSelection);
      }
    };
  }, [handleTextSelection]);



  useEffect(() => {
    if (!socketRef.current) {
      const token = localStorage.getItem('token');
      const socket = io('http://localhost:5000', {
        query: { token: token },
      });
      socketRef.current = socket;
    }

    if (documentId) {
      const userId = localStorage.getItem('userId') || 'guest';
      socketRef.current.emit('join-document', documentId, userId);
      console.log(`Joined document room: ${documentId} as user: ${userId}`);
    }

    socketRef.current.on('receive-changes', (remoteUserId, delta) => {
      console.log(`Received changes from ${remoteUserId}:`, delta);
      if (quillRef.current) {
        quillRef.current.getEditor().updateContents(delta);
      }
    });

    socketRef.current.on('load-document', (initialContent) => {
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

  useEffect(() => {
    let saveInterval;

    if (quillRef.current && documentId) {
      saveInterval = setInterval(async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('Authentication token not found, cannot auto-save.');
            return;
          }
          const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ content: quillRef.current.getEditor().getContents() }),
          });

          if (response.ok) {
            console.log('Document auto-saved.');
          } else {
            const errorData = await response.json();
            console.error('Auto-save failed:', errorData);
          }
        } catch (error) {
          console.error('Error during auto-save:', error);
        }
      }, SAVE_INTERVAL_MS);
    }

    return () => clearInterval(saveInterval);
  }, [documentId]);

  const handleChange = useCallback(
    (newContent, delta, source, editor) => {
      setContent(newContent);
      if (source === 'user' && socketRef.current) {
        throttledSendChanges(documentId, localStorage.getItem('userId') || 'guest', delta);
      }
    },
    [documentId]
  );

  const debouncedSendChanges = useCallback(
    debounce((documentId, userId, delta) => {
      if (socketRef.current) {
        socketRef.current.emit('text-change', documentId, userId, delta);
      }
    }, DEBOUNCE_DELAY),
    []
  );

  const throttledSendChanges = useCallback(
    throttle(
      (documentId, userId, delta) => {
        debouncedSendChanges(documentId, userId, delta);
      },
      THROTTLE_INTERVAL,
      { leading: false, trailing: true }
    ),
    []
  );

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'link',
    'image',
    'video',
  ];


  const themeClasses = {
    light: {
      container: 'bg-[#fefefe] rounded-xl shadow-xl p-6 border border-gray-200',
      toolbar: 'bg-[#f9f9f9] border-b border-gray-300',
      toolbarButton: 'bg-white hover:bg-gray-100 text-gray-800 font-medium px-4 py-2 rounded-lg shadow-sm transition',
      editor: 'h-[500px] bg-white text-gray-900 p-4 rounded-b-xl',
      closeButton: 'text-gray-600 hover:text-gray-900 transition font-medium',
    },
    dark: {
      container: 'bg-[#1e1e1e] rounded-xl shadow-xl p-6 border border-gray-700',
      toolbar: 'bg-[#2a2a2a] border-b border-gray-600',
      toolbarButton: 'bg-[#333] hover:bg-[#444] text-gray-100 font-medium px-4 py-2 rounded-lg shadow-sm transition',
      editor: 'h-[500px] bg-[#1e1e1e] text-gray-100 p-4 rounded-b-xl',
      closeButton: 'text-gray-300 hover:text-white transition font-medium',
    },
  };
  

  // return (
  //   <div className="container mx-auto my-20">
  //     <div className="flex justify-between items-center mb-4">
  //       <a href="/dashboard" onClick={(e) => {
  //         e.preventDefault();
  //         navigate('/dashboard');
  //       }} className={theme === 'light' ? 'text-gray-800 hover:text-gray-900' : 'text-gray-200 hover:text-gray-100'}>
  //         <h1>X Close</h1>
  //       </a>
  //       <button
  //         onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
  //         className={theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md' : 'bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-md'}
  //       >
  //         {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
  //       </button>
  //     </div>

  //     <div className={theme === 'light' ? 'bg-white shadow-md rounded-md overflow-hidden' : 'bg-gray-800 shadow-md rounded-md overflow-hidden'}>
  //       <div className={theme === 'light' ? 'bg-gray-100 border-b border-gray-200' : 'bg-gray-700 border-b border-gray-600'}>
  //         <ReactQuill
  //           ref={quillRef}
  //           theme="snow"
  //           value={content}
  //           onChange={handleChange}
  //           modules={modules}
  //           formats={formats}
  //           className={theme === 'light' ? 'h-96 bg-white text-gray-800' : 'h-96 bg-gray-800 text-gray-200'}
  //         />
  //       </div>
  //     </div>
  //     {documentId && <p className="text-sm text-gray-500 mt-2">Document ID: {documentId}</p>}
  //   </div>
  // );
  return (
    // <div className="min-h-screen mt-10 flex flex-col items-center justify-start bg-gradient-to-b from-[#ece9e6] to-[#ffffff] dark:from-[#111] dark:to-gray-900 transition-all duration-300 py-12 px-4">
    //   <div className={`w-full max-w-5xl ${themeClasses[theme].container}`}>
    //     <div className="flex justify-between items-center mb-4">
    //       <button
    //         onClick={() => navigate('/dashboard')}
    //         className={themeClasses[theme].closeButton}
    //       >
    //         ⬅ Back to Dashboard
    //       </button>
    //       <button
    //         onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    //         className={themeClasses[theme].toolbarButton}
    //       >
    //         {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    //       </button>
    //     </div>
  
    //     <ReactQuill
    //       ref={quillRef}
    //       theme="snow"
    //       value={content}
    //       onChange={handleChange}
    //       modules={modules}
    //       formats={formats}
    //       className={`mb-8 ${themeClasses[theme].editor}`}
    //     />
  
        
    //   </div>
    //   {documentId && (
    //       <p className="text-sm text-right text-gray-500 mt-2 italic">
    //         Document ID: <span className="font-mono">{documentId}</span>
    //       </p>
    //     )}
    // </div>
    <div className="min-h-screen mt-10 flex bg-gradient-to-b from-[#ece9e6] to-[#ffffff] dark:from-[#111] dark:to-gray-900 transition-all duration-300 py-12 px-4">
      <div className="relative w-full max-w-5xl flex"> {/* Make this a flex container */}
        <div className="flex-1 mr-4"> {/* Editor takes up most of the space */}
          <div className={`mb-8 ${themeClasses[theme].container}`}>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigate('/dashboard')}
                className={themeClasses[theme].closeButton}
              >
                ⬅ Back to Dashboard
              </button>
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={themeClasses[theme].toolbarButton}
              >
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
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
            </p>
          )}
        </div>

        {isAISideChatOpen && (
          <AISideChat
            selectedText={selectedText}
            onApply={handleApplyAIResponse}
          />
        )}
      </div>
    </div>
  );
  
  
}

export default QuillNewEditor;