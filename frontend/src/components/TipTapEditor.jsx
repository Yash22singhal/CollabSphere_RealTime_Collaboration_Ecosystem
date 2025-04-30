import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

function TiptapEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState(null);
  const editor = useRef(null);
  const [jsonContent, setJsonContent] = useState(null);

  const tipTapEditor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            'class': 'text-2xl font-bold mb-2',
          },
        },
        paragraph: {
          HTMLAttributes: {
            'class': 'mb-4',
          },
        },
        blockquote: {
          HTMLAttributes: {
            'class': 'border-l-4 border-gray-300 pl-4 italic mb-4',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            'class': 'bg-gray-100 rounded-md p-4 font-mono text-sm mb-4',
          },
        },
        bulletList: {
          HTMLAttributes: {
            'class': 'list-disc pl-5 mb-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            'class': 'list-decimal pl-5 mb-4',
          },
        },
      }),
      Bold, // No need to configure Bold/Italic for basic styling
      Italic,
      Heading,
      Blockquote,
      CodeBlock,
      BulletList,
      OrderedList,
      HorizontalRule,
    ],
    content: '<p>Start writing something...</p>',
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      setJsonContent(json);
      console.log(json);
    },
  });

  useEffect(() => {
    const newSocket = io(url);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && tipTapEditor) {
      const userId = localStorage.getItem('userId');

      if (userId) {
        socket.emit('join-document', documentId, userId);
        console.log(`User ${userId} joined document ${documentId}`);
      } else {
        console.error('User ID not found, cannot join document.');
      }

      socket.on('load-document', (initialContent) => {
        tipTapEditor.commands.setContent(initialContent || '<p>Start writing something...</p>');
      });

      socket.on('receive-changes', (delta) => {
        // We'll adapt this later
        console.log('Received delta:', delta);
      });
    }
  }, [socket, tipTapEditor, documentId]);

  if (!tipTapEditor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <div className="toolbar mb-2 flex flex-wrap gap-2">
        <button
          onClick={() => tipTapEditor.commands.toggleBold()}
          className="bg-gray-200 hover:bg-gray-300 rounded-md px-2 py-1 text-sm font-semibold"
        >
          {tipTapEditor.isActive('bold') ? 'Unbold' : 'Bold'}
        </button>
        <button
          onClick={() => tipTapEditor.commands.toggleItalic()}
          className="bg-gray-200 hover:bg-gray-300 rounded-md px-2 py-1 text-sm font-semibold"
        >
          {tipTapEditor.isActive('italic') ? 'Unitalic' : 'Italic'}
        </button>
        <button
          onClick={() => tipTapEditor.commands.setHeading({ level: 1 })}
          className="bg-gray-200 hover:bg-gray-300 rounded-md px-2 py-1 text-sm font-semibold"
        >
          H1
        </button>
        <button
          onClick={() => tipTapEditor.commands.setHeading({ level: 2 })}
          className="bg-gray-200 hover:bg-gray-300 rounded-md px-2 py-1 text-sm font-semibold"
        >
          H2
        </button>
        <button
          onClick={() => tipTapEditor.commands.setHeading({ level: 3 })}
          className="bg-gray-200 hover:bg-gray-300 rounded-md px-2 py-1 text-sm font-semibold"
        >
          H3
        </button>
        <button
          onClick={() => tipTapEditor.commands.toggleBulletList()}
          className="bg-gray-200 hover:bg-gray-300 rounded-md px-2 py-1 text-sm font-semibold"
        >
          Bullet List
        </button>
        <button
          onClick={() => tipTapEditor.commands.toggleOrderedList()}
          className="bg-gray-200 hover:bg-gray-300 rounded-md px-2 py-1 text-sm font-semibold"
        >
          Ordered List
        </button>
        <button
          onClick={() => tipTapEditor.commands.toggleBlockquote()}
          className="bg-gray-200 hover:bg-gray-300 rounded-md px-2 py-1 text-sm font-semibold"
        >
          Blockquote
        </button>
        <button
          onClick={() => tipTapEditor.commands.toggleCodeBlock()}
          className="bg-gray-200 hover:bg-gray-300 rounded-md px-2 py-1 text-sm font-semibold"
        >
          Code Block
        </button>
        <button
          onClick={() => tipTapEditor.commands.setHorizontalRule()}
          className="bg-gray-200 hover:bg-gray-300 rounded-md px-2 py-1 text-sm font-semibold"
        >
          Horizontal Rule
        </button>
      </div>
      <EditorContent
        editor={tipTapEditor}
        className="bg-white shadow-md rounded-md border min-h-[200px]"
      />
      <pre className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
        {JSON.stringify(jsonContent, null, 2)}
      </pre>
    </div>
  );
}

export default TiptapEditor;