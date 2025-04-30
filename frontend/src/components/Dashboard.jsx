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

  const handleDeleteDocument = async (documentId) => {
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOwnedDocuments(ownedDocuments.filter((doc) => doc._id !== documentId));
        setMessage('Document deleted successfully!');
      } else {
        setError(data.message || 'Failed to delete document.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while deleting the document.');
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
                  <li key={doc._id} className="bg-gray-100 dark:bg-[#383b40] px-4 py-3 rounded-lg shadow hover:shadow-md transition flex justify-between items-center">
                    <div>
                      <Link to={`/documents/${doc._id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                        {doc.title || 'Untitled Document'}
                      </Link>
                      <span className="text-sm text-gray-500 ml-2">(Owner)</span>
                    </div>
                    <button
                      onClick={() => handleDeleteDocument(doc._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs"
                    >
                      Delete
                    </button>
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