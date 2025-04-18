// import React, { useState, useEffect } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { io } from 'socket.io-client';
// import { useParams } from 'react-router-dom'; // Assuming you're using React Router

// const SAVE_INTERVAL_MS = 2000;

// function DocumentEditor() {


//   const { id: documentId } = useParams(); // Get the document ID from the route
//   const [quill, setQuill] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [content, setContent] = useState('');

//   useEffect(() => {
//     const newSocket = io('http://localhost:5000'); // Connect to your backend Socket.IO server
//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (socket && quill) {
//       const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage

//       if (userId) {
//         socket.emit('join-document', documentId, userId); // Use the actual user ID
//         console.log(`User ${userId} joined document ${documentId}`);
//       } else {
//         console.error('User ID not found, cannot join document.');
//         // Optionally, redirect the user to the login page or handle this scenario
//       }

//       socket.on('load-document', (initialContent) => {
//         quill.setContents(initialContent || '');
//         setContent(initialContent || '');
//       });

//       socket.on('receive-changes', (delta) => {
//         quill.updateContents(delta);
//       });
//     }
//   }, [socket, quill, documentId]);

//   useEffect(() => {
//     let interval;

//     if (quill && documentId) {
//       interval = setInterval(async () => {
//         try {
//           const token = localStorage.getItem('authToken');
//           if (!token) {
//             console.error('Authentication token not found, cannot auto-save.');
//             return;
//           }

//           const response = await fetch(`/api/documents/${documentId}`, {
//             method: 'PUT',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify({ content: quill.getContents() }), // Send the Quill content
//           });

//           if (response.ok) {
//             console.log('Document auto-saved successfully.');
//             // Optionally, display a visual indicator to the user
//           } else {
//             const errorData = await response.json();
//             console.error('Failed to auto-save document:', errorData);
//             // Optionally, display an error message to the user
//           }
//         } catch (error) {
//           console.error('Error during auto-save:', error);
//           // Optionally, display an error message to the user
//         }
//       }, SAVE_INTERVAL_MS);
//     }

//     return () => clearInterval(interval);
//   }, [quill, documentId]);


//   const handleTextChange = (delta, oldDelta, source, editor) => {
//     setContent(editor.getContents());
//     if (socket && source === 'user') {
//       socket.emit('text-change', delta);
//     }
//   };

//   useEffect(() => {
//     let interval;

//     if (quill) {
//       interval = setInterval(() => {
//         // Implement your auto-save logic here, e.g., send content to backend
//         console.log('Saving document:', quill.getContents());
//       }, SAVE_INTERVAL_MS);
//     }

//     return () => clearInterval(interval);
//   }, [quill]);

//   const modules = {
//     toolbar: [
//       ['bold', 'italic', 'underline', 'strike'], // toggled buttons
//       ['blockquote', 'code-block'],

//       [{ 'header': 1 }, { 'header': 2 }], // custom button values
//       [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//       [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
//       [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
//       [{ 'direction': 'rtl' }], // text direction

//       [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
//       [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

//       [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
//       [{ 'font': [] }],
//       [{ 'align': [] }],

//       ['clean'] // remove formatting button
//     ],
//   };

//   return (
//     <div className="container mx-auto mt-10">
//       <ReactQuill
//         ref={(el) => setQuill(el)}
//         value={content}
//         onChange={handleTextChange}
//         modules={modules}
//         className="bg-white shadow-md rounded-md border"
//       />
//     </div>
//   );
// }

// export default DocumentEditor;






// import React, { useState, useEffect } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { io } from 'socket.io-client';
// import { useParams } from 'react-router-dom';

// const SAVE_INTERVAL_MS = 2000;

// function DocumentEditor() {
//   const { id: documentId } = useParams();
//   const [quill, setQuill] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [content, setContent] = useState('');

//   useEffect(() => {
//     const newSocket = io('http://localhost:5000');
//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (socket && quill) {
//       const userId = localStorage.getItem('userId');

//       if (userId) {
//         socket.emit('join-document', documentId, userId);
//         console.log(`User ${userId} joined document ${documentId}`);
//       } else {
//         console.error('User ID not found, cannot join document.');
//         // Handle no user ID scenario
//       }

//       socket.on('load-document', (initialContent) => {
//         quill.setContents(initialContent || '');
//         setContent(initialContent || '');
//       });

//       socket.on('receive-changes', (delta) => {
//         quill.updateContents(delta);
//       });
//     }
//   }, [socket, quill, documentId]);

//   const handleTextChange = (delta, oldDelta, source, editor) => {
//     setContent(editor.getContents());
//     if (socket && source === 'user') {
//       socket.emit('text-change', delta);
//     }
//   };

//   useEffect(() => {
//     let interval;

//     if (quill && documentId) {
//       interval = setInterval(async () => {
//         try {
//           const token = localStorage.getItem('authToken');
//           if (!token) {
//             console.error('Authentication token not found, cannot auto-save.');
//             return;
//           }

//           const response = await fetch(`/api/documents/${documentId}`, {
//             method: 'PUT',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify({ content: quill.getContents() }),
//           });

//           if (response.ok) {
//             console.log('Document auto-saved successfully.');
//           } else {
//             const errorData = await response.json();
//             console.error('Failed to auto-save document:', errorData);
//           }
//         } catch (error) {
//           console.error('Error during auto-save:', error);
//         }
//       }, SAVE_INTERVAL_MS);
//     }

//     return () => clearInterval(interval);
//   }, [quill, documentId]);

//   const modules = {
//     toolbar: [
//       ['bold', 'italic', 'underline', 'strike'],
//       ['blockquote', 'code-block'],
//       [{ 'header': 1 }, { 'header': 2 }],
//       [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//       [{ 'script': 'sub' }, { 'script': 'super' }],
//       [{ 'indent': '-1' }, { 'indent': '+1' }],
//       [{ 'direction': 'rtl' }],
//       [{ 'size': ['small', false, 'large', 'huge'] }],
//       [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//       [{ 'color': [] }, { 'background': [] }],
//       [{ 'font': [] }],
//       [{ 'align': [] }],
//       ['clean']
//     ],
//   };

//   return (
//     <div className="container mx-auto mt-10">
//       <ReactQuill
//         ref={(el) => setQuill(el)}
//         value={content}
//         onChange={handleTextChange}
//         modules={modules}
//         className="bg-white shadow-md rounded-md border"
//       />
//     </div>
//   );
// }

// export default DocumentEditor;