// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// function Dashboard() {
//   const [ownedDocuments, setOwnedDocuments] = useState([]);
//   const [collaboratedDocuments, setCollaboratedDocuments] = useState([]);
//   const [newDocumentTitle, setNewDocumentTitle] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           console.error('No authentication token found.');
//           return;
//         }

//         const ownedResponse = await fetch('http://localhost:5000/api/documents/user/documents', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         const collaboratedResponse = await fetch('http://localhost:5000/api/documents/user/collaborations', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (ownedResponse.ok && collaboratedResponse.ok) {
//           const ownedData = await ownedResponse.json();
//           const collaboratedData = await collaboratedResponse.json();
//           setOwnedDocuments(ownedData);
//           setCollaboratedDocuments(collaboratedData);
//         } else {
//           const ownedErrorData = ownedResponse.ok ? null : await ownedResponse.json();
//           const collaboratedErrorData = collaboratedResponse.ok ? null : await collaboratedResponse.json();
//           setError(ownedErrorData?.message || collaboratedErrorData?.message || 'Failed to fetch documents.');
//           console.error('Failed to fetch documents:', ownedErrorData, collaboratedErrorData);
//         }
//       } catch (error) {
//         setError('An unexpected error occurred while fetching documents.');
//         console.error('Error fetching documents:', error);
//       }
//     };

//     fetchDocuments();
//   }, []);

//   const handleCreateNewDocument = async () => {
//     setError('');
//     setMessage('');

//     if (!newDocumentTitle.trim()) {
//       setError('Please enter a title for the new document.');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('No authentication token found.');
//         return;
//       }

//       const response = await fetch('http://localhost:5000/api/documents/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ title: newDocumentTitle }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setMessage('Document created successfully!');
//         setOwnedDocuments([...ownedDocuments, data]);
//         setNewDocumentTitle('');
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || 'Failed to create document.');
//         console.error('Failed to create document:', errorData);
//       }
//     } catch (error) {
//       setError('An unexpected error occurred while creating the document.');
//       console.error('Error creating document:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto my-20 p-6 bg-white rounded-md shadow-md">
//       <h2 className="text-2xl font-bold mb-4">My Documents</h2>
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       {message && <div className="text-green-500 mb-4">{message}</div>}

//       <div className="mb-4">
//         <input
//           type="text"
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           placeholder="New document title"
//           value={newDocumentTitle}
//           onChange={(e) => setNewDocumentTitle(e.target.value)}
//         />
//         <button
//           className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
//           onClick={handleCreateNewDocument}
//         >
//           Create New Document
//         </button>
//       </div>

//       {ownedDocuments.length > 0 && (
//         <div>
//           <h3 className="text-xl font-semibold mt-6 mb-2">Owned Documents</h3>
//           <ul className="list-disc pl-5">
//             {ownedDocuments.map((doc) => (
//               <li key={doc._id} className="py-2">
//                 <Link to={`/documents/${doc._id}`} className="text-blue-500 hover:underline">
//                   {doc.title || 'Untitled Document'}
//                 </Link>
//                 <span className="text-gray-500 ml-2">(Owner)</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {collaboratedDocuments.length > 0 && (
//         <div>
//           <h3 className="text-xl font-semibold mt-6 mb-2">Collaborated Documents</h3>
//           <ul className="list-disc pl-5">
//             {collaboratedDocuments.map((doc) => (
//               <li key={doc._id} className="py-2">
//                 <Link to={`/documents/${doc._id}`} className="text-blue-500 hover:underline">
//                   {doc.title || 'Untitled Document'}
//                 </Link>
//                 <span className="text-gray-500 ml-2">
//                   (Shared by {doc.owner.username})
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [ownedDocuments, setOwnedDocuments] = useState([]);
  const [collaboratedDocuments, setCollaboratedDocuments] = useState([]);
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const [ownedRes, collabRes] = await Promise.all([
          fetch('http://localhost:5000/api/documents/user/documents', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/documents/user/collaborations', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const ownedData = ownedRes.ok ? await ownedRes.json() : null;
        const collabData = collabRes.ok ? await collabRes.json() : null;

        if (ownedRes.ok) setOwnedDocuments(ownedData);
        if (collabRes.ok) setCollaboratedDocuments(collabData);

        if (!ownedRes.ok || !collabRes.ok) {
          const errorData = ownedData || collabData;
          setError(errorData?.message || 'Failed to fetch documents.');
        }
      } catch (err) {
        console.error(err);
        setError('An unexpected error occurred while fetching documents.');
      }
    };

    fetchDocuments();
  }, []);

  const handleCreateNewDocument = async () => {
    setError('');
    setMessage('');

    if (!newDocumentTitle.trim()) {
      setError('Please enter a title for the new document.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/documents/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newDocumentTitle }),
      });

      const data = await response.json();

      if (response.ok) {
        setOwnedDocuments([...ownedDocuments, data]);
        setMessage('🎉 Document created successfully!');
        setNewDocumentTitle('');
      } else {
        setError(data.message || 'Failed to create document.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while creating the document.');
    }
  };

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-[#f7f8fc] to-[#e3e9f0] dark:from-[#1a1c1f] dark:to-[#2a2e35] transition-all duration-500">
      <div className="max-w-4xl mx-auto py-14 px-6">
        <div className="bg-white dark:bg-[#2d2f33] shadow-2xl rounded-3xl p-8 transition-all duration-300">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">📂 My Documents</h2>

          {error && <div className="text-red-500 bg-red-100 dark:bg-red-800 p-3 rounded-md mb-4">{error}</div>}
          {message && <div className="text-green-600 bg-green-100 dark:bg-green-700 p-3 rounded-md mb-4">{message}</div>}

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-[#3a3d42] dark:text-white"
              placeholder="Enter new document title..."
              value={newDocumentTitle}
              onChange={(e) => setNewDocumentTitle(e.target.value)}
            />
            <button
              onClick={handleCreateNewDocument}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300 shadow-md"
            >
              ➕ Create
            </button>
          </div>

          {ownedDocuments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">📘 Owned Documents</h3>
              <ul className="space-y-2">
                {ownedDocuments.map((doc) => (
                  <li key={doc._id} className="bg-gray-100 dark:bg-[#383b40] px-4 py-3 rounded-lg shadow hover:shadow-md transition">
                    <Link to={`/documents/${doc._id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                      {doc.title || 'Untitled Document'}
                    </Link>
                    <span className="text-sm text-gray-500 ml-2">(Owner)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {collaboratedDocuments.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">🤝 Collaborated Documents</h3>
              <ul className="space-y-2">
                {collaboratedDocuments.map((doc) => (
                  <li key={doc._id} className="bg-gray-100 dark:bg-[#383b40] px-4 py-3 rounded-lg shadow hover:shadow-md transition">
                    <Link to={`/documents/${doc._id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                      {doc.title || 'Untitled Document'}
                    </Link>
                    <span className="text-sm text-gray-500 ml-2">
                      (Shared by <span className="font-medium">{doc.owner.username}</span>)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;









// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';

// function DocumentDetails() {
//   const { id: documentId } = useParams();
//   const [document, setDocument] = useState(null);
//   const [error, setError] = useState('');
//   const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [isOwner, setIsOwner] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDocumentDetails = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) return navigate('/login');

//         const res = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.ok) {
//           const data = await res.json();
//           setDocument(data);
//           setIsOwner(data.owner._id === localStorage.getItem('userId'));
//         } else {
//           const errorData = await res.json();
//           setError(errorData.message || 'Failed to fetch document details.');
//         }
//       } catch (err) {
//         setError('An unexpected error occurred while fetching document details.');
//       }
//     };

//     fetchDocumentDetails();
//   }, [documentId, navigate]);

//   const handleSearchCollaborator = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const res = await fetch(`http://localhost:5000/api/auth/users/search?query=${newCollaboratorEmail}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setSearchResults(data);
//       } else {
//         const errorData = await res.json();
//         setError(errorData.message || 'Failed to search for users.');
//       }
//     } catch {
//       setError('An unexpected error occurred while searching for users.');
//     }
//   };

//   const handleAddCollaborator = async (collaboratorId) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const res = await fetch(`http://localhost:5000/api/documents/${documentId}/share`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId: collaboratorId, action: 'add' }),
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setDocument(data);
//         setNewCollaboratorEmail('');
//         setSearchResults([]);
//       } else {
//         const errorData = await res.json();
//         setError(errorData.message || 'Failed to add collaborator.');
//       }
//     } catch {
//       setError('An unexpected error occurred while adding collaborator.');
//     }
//   };

//   const handleRemoveCollaborator = async (userId) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const res = await fetch(`http://localhost:5000/api/documents/${documentId}/share`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId, action: 'remove' }),
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setDocument(data);
//       } else {
//         const errorData = await res.json();
//         setError(errorData.message || 'Failed to remove collaborator.');
//       }
//     } catch {
//       setError('An unexpected error occurred while removing collaborator.');
//     }
//   };

//   if (!document) return <div className="text-center mt-10 text-gray-600">Loading document details...</div>;

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6 bg-gradient-to-b from-[#111] to-gray-900 shadow-lg rounded-2xl border border-gray-200">
//       <h2 className="text-3xl font-bold text-[#424242] mb-4">{document.title}</h2>
//       {error && <div className="text-red-500 mb-4">{error}</div>}

//       <div className="text-sm text-gray-600 mb-6">
//         <p><strong>Owner:</strong> {document.owner.username} ({document.owner.email})</p>
//         <p><strong>Created:</strong> {new Date(document.createdAt).toLocaleString()}</p>
//       </div>

//       <div className="mt-6">
//         <h3 className="text-xl font-semibold text-[#424242] mb-2">Collaborators</h3>
//         {document.collaborators.length > 0 ? (
//           <ul className="space-y-2">
//             {document.collaborators.map((collaborator) => (
//               <li key={collaborator._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm border border-gray-200">
//                 <span className="text-gray-800">{collaborator.username} ({collaborator.email})</span>
//                 {isOwner && (
//                   <button
//                     onClick={() => handleRemoveCollaborator(collaborator._id)}
//                     className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">No collaborators added yet.</p>
//         )}

//         {isOwner && (
//           <div className="mt-6">
//             <input
//               type="text"
//               placeholder="Enter collaborator's email"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
//               value={newCollaboratorEmail}
//               onChange={(e) => setNewCollaboratorEmail(e.target.value)}
//             />
//             <button
//               onClick={handleSearchCollaborator}
//               className="bg-[#424242] hover:bg-black text-white px-4 py-2 rounded-md shadow-md"
//             >
//               Search Collaborator
//             </button>

//             {searchResults.length > 0 && (
//               <div className="mt-4">
//                 <h4 className="font-semibold text-[#424242] mb-2">Search Results</h4>
//                 {searchResults.map((user) => (
//                   <div key={user._id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm mb-2">
//                     <span>{user.username} ({user.email})</span>
//                     <button
//                       onClick={() => handleAddCollaborator(user._id)}
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
//                     >
//                       Add
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="mt-8">
//         <Link
//           to={`/documents/${documentId}/edit`}
//           className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow-md"
//         >
//           Open Editor
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default DocumentDetails;
