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
//         if (!token) {
//           console.error('No authentication token found.');
//           navigate('/login'); // Or wherever your login route is
//           return;
//         }

//         const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setDocument(data);
//           setIsOwner(data.owner._id === localStorage.getItem('userId'));
//         } else {
//           const errorData = await response.json();
//           setError(errorData.message || 'Failed to fetch document details.');
//           console.error('Failed to fetch document details:', errorData);
//         }
//       } catch (error) {
//         setError('An unexpected error occurred while fetching document details.');
//         console.error('Error fetching document details:', error);
//       }
//     };

//     fetchDocumentDetails();
//   }, [documentId, navigate]);

//   const handleSearchCollaborator = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('No authentication token found.');
//         return;
//       }

//       const response = await fetch(`http://localhost:5000/api/auth/users/search?query=${newCollaboratorEmail}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setSearchResults(data);
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || 'Failed to search for users.');
//         console.error('Failed to search for users:', errorData);
//       }
//     } catch (error) {
//       setError('An unexpected error occurred while searching for users.');
//       console.error('Error searching for users:', error);
//     }
//   };

//   const handleAddCollaborator = async (collaboratorId) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('No authentication token found.');
//         return;
//       }

//       const response = await fetch(`http://localhost:5000/api/documents/${documentId}/share`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId: collaboratorId, action: 'add' }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setDocument(data);
//         setNewCollaboratorEmail('');
//         setSearchResults([]);
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || 'Failed to add collaborator.');
//         console.error('Failed to add collaborator:', errorData);
//       }
//     } catch (error) {
//       setError('An unexpected error occurred while adding collaborator.');
//       console.error('Error adding collaborator:', error);
//     }
//   };

//   const handleRemoveCollaborator = async (userId) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('No authentication token found.');
//         return;
//       }

//       const response = await fetch(`http://localhost:5000/api/documents/${documentId}/share`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId: userId, action: 'remove' }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setDocument(data);
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || 'Failed to remove collaborator.');
//         console.error('Failed to remove collaborator:', errorData);
//       }
//     } catch (error) {
//       setError('An unexpected error occurred while removing collaborator.');
//       console.error('Error removing collaborator:', error);
//     }
//   };

//   if (!document) {
//     return <div>Loading document details...</div>;
//   }

//   return (
//     <div className="container mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
//       <h2 className="text-2xl font-bold mb-4">{document.title}</h2>
//       {error && <div className="text-red-500 mb-4">{error}</div>}

//       <div className="mb-4">
//         <p>Owner: {document.owner.username} ({document.owner.email})</p>
//         <p>Created At: {new Date(document.createdAt).toLocaleString()}</p>
//       </div>

//       <div>
//         <h3 className="text-xl font-semibold mb-2">Collaborators</h3>
//         {document.collaborators.length > 0 ? (
//           <ul>
//             {document.collaborators.map((collaborator) => (
//               <li key={collaborator._id} className="flex items-center justify-between py-2 border-b">
//                 <span>{collaborator.username} ({collaborator.email})</span>
//                 {isOwner && (
//                   <button
//                     onClick={() => handleRemoveCollaborator(collaborator._id)}
//                     className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No collaborators added yet.</p>
//         )}

//         {isOwner && (
//           <div className="mt-4">
//             <input
//               type="text"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               placeholder="Enter collaborator's email"
//               value={newCollaboratorEmail}
//               onChange={(e) => setNewCollaboratorEmail(e.target.value)}
//             />
//             <button
//               onClick={handleSearchCollaborator}
//               className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
//             >
//               Search Collaborator
//             </button>

//             {searchResults.length > 0 && (
//               <div className="mt-2">
//                 {searchResults.map((user) => (
//                   <div key={user._id} className="flex items-center justify-between py-2 border-b">
//                     <span>{user.username} ({user.email})</span>
//                     <button
//                       onClick={() => handleAddCollaborator(user._id)}
//                       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                     >
//                       Add
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//         <Link to={`/documents/${documentId}/edit`} className="inline-block mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
//           Open Editor
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default DocumentDetails;




import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function DocumentDetails() {
  const { id: documentId } = useParams();
  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();
  const {url} = useContext(AppContext);
  //const url = "https://collabsphere-realtime-collaboration.onrender.com"

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await fetch(
          `${url}/api/documents/${documentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setDocument(data);
          setIsOwner(data.owner._id === localStorage.getItem("userId"));
        } else {
          const errorData = await res.json();
          setError(errorData.message || "Failed to fetch document details.");
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching document details."
        );
      }
    };

    fetchDocumentDetails();
  }, [documentId, navigate]);

  const handleSearchCollaborator = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `${url}/api/auth/users/search?query=${newCollaboratorEmail}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to search for users.");
      }
    } catch {
      setError("An unexpected error occurred while searching for users.");
    }
  };

  const handleAddCollaborator = async (collaboratorId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
       `${url}/api/documents/${documentId}/share`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: collaboratorId, action: "add" }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setDocument(data);
        setNewCollaboratorEmail("");
        setSearchResults([]);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to add collaborator.");
      }
    } catch {
      setError("An unexpected error occurred while adding collaborator.");
    }
  };

  const handleRemoveCollaborator = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `${url}/api/documents/${documentId}/share`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, action: "remove" }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setDocument(data);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to remove collaborator.");
      }
    } catch {
      setError("An unexpected error occurred while removing collaborator.");
    }
  };

  if (!document)
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading document details...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-20 mb-10 p-6 bg-[#1e1e1e] shadow-lg rounded-2xl border border-gray-700 text-white">
      <h2 className="text-3xl font-bold text-white mb-4">{document.title}</h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}

      <div className="text-sm text-gray-400 mb-6">
        <p>
          <strong>Owner:</strong> {document.owner.username} (
          {document.owner.email})
        </p>
        <p>
          <strong>Created:</strong>{" "}
          {new Date(document.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-white mb-2">Collaborators</h3>
        {document.collaborators.length > 0 ? (
          <ul className="space-y-2">
            {document.collaborators.map((collaborator) => (
              <li
                key={collaborator._id}
                className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded-md shadow-sm border border-gray-600"
              >
                <span className="text-gray-200">
                  {collaborator.username} ({collaborator.email})
                </span>
                {isOwner && (
                  <button
                    onClick={() => handleRemoveCollaborator(collaborator._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No collaborators added yet.</p>
        )}

        {isOwner && (
          <div className="mt-6">
            <input
              type="text"
              placeholder="Enter collaborator's email"
              className="w-full border border-gray-600 bg-[#2a2a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3 placeholder-gray-400"
              value={newCollaboratorEmail}
              onChange={(e) => setNewCollaboratorEmail(e.target.value)}
            />
            <button
              onClick={handleSearchCollaborator}
              className="bg-[#424242] hover:bg-black text-white px-4 py-2 rounded-md shadow-md"
            >
              Search Collaborator
            </button>

            {searchResults.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-white mb-2">
                  Search Results
                </h4>
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded-md shadow-sm mb-2 border border-gray-600"
                  >
                    <span className="text-gray-200">
                      {user.username} ({user.email})
                    </span>
                    <button
                      onClick={() => handleAddCollaborator(user._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link
          to={`/documents/${documentId}/edit`}
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow-md"
        >
          Open Editor
        </Link>
      </div>
    </div>
  );
}

export default DocumentDetails;
