import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ScrollToTopButton from "./ScrollToTopButton";

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
    
      // <div className="max-w-4xl mx-auto mt-20 mb-10 p-6 bg-[#1e1e1e] shadow-lg rounded-2xl border border-gray-700 text-white">
      //   <h2 className="text-3xl font-bold text-white mb-4">{document.title}</h2>
      //   {error && <div className="text-red-400 mb-4">{error}</div>}

      //   <div className="text-sm text-gray-400 mb-6">
      //     <p>
      //       <strong>Owner:</strong> {document.owner.username} (
      //       {document.owner.email})
      //     </p>
      //     <p>
      //       <strong>Created:</strong>{" "}
      //       {new Date(document.createdAt).toLocaleString()}
      //     </p>
      //   </div>

      //   <div className="mt-6">
      //     <h3 className="text-xl font-semibold text-white mb-2">Collaborators</h3>
      //     {document.collaborators.length > 0 ? (
      //       <ul className="space-y-2">
      //         {document.collaborators.map((collaborator) => (
      //           <li
      //             key={collaborator._id}
      //             className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded-md shadow-sm border border-gray-600"
      //           >
      //             <span className="text-gray-200">
      //               {collaborator.username} ({collaborator.email})
      //             </span>
      //             {isOwner && (
      //               <button
      //                 onClick={() => handleRemoveCollaborator(collaborator._id)}
      //                 className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
      //               >
      //                 Remove
      //               </button>
      //             )}
      //           </li>
      //         ))}
      //       </ul>
      //     ) : (
      //       <p className="text-gray-500">No collaborators added yet.</p>
      //     )}

      //     {isOwner && (
      //       <div className="mt-6">
      //         <input
      //           type="text"
      //           placeholder="Enter collaborator's email"
      //           className="w-full border border-gray-600 bg-[#2a2a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3 placeholder-gray-400"
      //           value={newCollaboratorEmail}
      //           onChange={(e) => setNewCollaboratorEmail(e.target.value)}
      //         />
      //         <button
      //           onClick={handleSearchCollaborator}
      //           className="bg-[#424242] hover:bg-black text-white px-4 py-2 rounded-md shadow-md"
      //         >
      //           Search Collaborator
      //         </button>

      //         {searchResults.length > 0 && (
      //           <div className="mt-4">
      //             <h4 className="font-semibold text-white mb-2">
      //               Search Results
      //             </h4>
      //             {searchResults.map((user) => (
      //               <div
      //                 key={user._id}
      //                 className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded-md shadow-sm mb-2 border border-gray-600"
      //               >
      //                 <span className="text-gray-200">
      //                   {user.username} ({user.email})
      //                 </span>
      //                 <button
      //                   onClick={() => handleAddCollaborator(user._id)}
      //                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
      //                 >
      //                   Add
      //                 </button>
      //               </div>
      //             ))}
      //           </div>
      //         )}
      //       </div>
      //     )}
      //   </div>

      //   <div className="mt-8">
      //     <Link
      //       to={`/documents/${documentId}/edit`}
      //       className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md shadow-md"
      //     >
      //       Open Editor
      //     </Link>
      //   </div>
      // </div> 
        <div className="min-h-screen mt-16 bg-gradient-to-br from-[#1f1c2c] via-[#302b63] to-[#24243e] px-4 py-12">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg text-white rounded-3xl shadow-2xl p-8 border border-white/20">
      
            <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-2">
              📄 {document.title}
            </h2>
      
            {error && (
              <div className="bg-red-600/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
                ⚠️ {error}
              </div>
            )}
      
            <div className="text-sm text-gray-300 mb-8">
              <p>
                <strong>👤 Owner:</strong> {document.owner.username} ({document.owner.email})
              </p>
              <p>
                <strong>🕒 Created:</strong> {new Date(document.createdAt).toLocaleString()}
              </p>
            </div>
      
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">🤝 Collaborators</h3>
              {document.collaborators.length > 0 ? (
                <ul className="space-y-3">
                  {document.collaborators.map((collaborator) => (
                    <li
                      key={collaborator._id}
                      className="flex items-center justify-between bg-white/10 p-3 rounded-lg border border-white/20"
                    >
                      <span className="text-gray-100">
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
                <p className="text-gray-400">No collaborators added yet.</p>
              )}
      
              {isOwner && (
                <div className="mt-6">
                  <input
                    type="text"
                    placeholder="Enter collaborator's email"
                    className="w-full border border-white/30 bg-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3 placeholder-gray-400"
                    value={newCollaboratorEmail}
                    onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  />
                  <button
                    onClick={handleSearchCollaborator}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-md"
                  >
                    Search Collaborator
                  </button>
      
                  {searchResults.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-white mb-2">🔍 Search Results</h4>
                      {searchResults.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between bg-white/10 p-3 rounded-lg border border-white/20 mb-2"
                        >
                          <span className="text-gray-100">
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
      
            <div className="mt-10 text-center">
              <Link
                to={`/documents/${documentId}/edit`}
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
              >
                ✏️ Open Editor
              </Link>
            </div>
          </div>
          <ScrollToTopButton />
        </div>


  );
}

export default DocumentDetails;
