import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import DocumentCard from './DocumentCard';
import {assets} from '../assets/data';

function Dashboard() {
  const [ownedDocuments, setOwnedDocuments] = useState([]);
  const [collaboratedDocuments, setCollaboratedDocuments] = useState([]);
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const {url, token, user} = useContext(AppContext);
  //const url = "https://collabsphere-realtime-collaboration.onrender.com"

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const [ownedRes, collabRes] = await Promise.all([
            fetch(`${url}/api/documents/user/documents`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${url}/api/documents/user/collaborations`, {
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

      const response = await fetch(`${url}/api/documents/`, {
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
    //<div className="min-h-screen mt-10 bg-gradient-to-br from-[#f7f8fc] to-[#e3e9f0] dark:from-[#1a1c1f] dark:to-[#2a2e35] transition-all duration-500">
    // <div className="min-h-screen mt-16 transition-all duration-500 bg-gradient-to-b from-[#2E8BC0] to-gray-900">
    //   <div className="max-w-4xl mx-auto pt-14 pb-5 px-6">
    //     <div className='flex gap-10 items-center pb-10'>
    //       {user.avatar ? 
    //         <img src='/profile-pic.jpg' alt="" className='w-2xs rounded-full' />  :
    //         <img src={assets.user_icon} alt="" className='rounded-full max-w-[150px]'/>
    //       }
    //       <div className=''>
    //         <h1 className='text-2xl font-bold uppercase text-gray-50'>{user.username}</h1>
    //         <p className='text-gray-200'>{user.email}</p>
    //       </div>
    //     </div>
    //     <div className=" p-5 transition-all duration-300">
    //       <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">📂 My Documents</h2>

    //       {error && <div className="text-red-500 bg-red-100 dark:bg-red-800 p-3 rounded-md mb-4">{error}</div>}
    //       {message && <div className="text-green-600 bg-green-100 dark:bg-green-700 p-3 rounded-md mb-4">{message}</div>}

    //       {/* create document */}
    //       <div className="flex gap-3 mb-6">
    //         <input
    //           type="text"
    //           className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-[#3a3d42] dark:text-white"
    //           placeholder="Enter new document title..."
    //           value={newDocumentTitle}
    //           onChange={(e) => setNewDocumentTitle(e.target.value)}
    //         />
    //         <button
    //           onClick={handleCreateNewDocument}
    //           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300 shadow-md"
    //         >
    //           ➕ Create
    //         </button>
    //       </div>

    //       {/* Owned Documents */}
    //       {ownedDocuments.length > 0 && (
    //         <div className="mb-6">
    //           <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">📘 Owned Documents</h3>
    //           <div className="grid grid-cols-2 gap-8">
    //             {ownedDocuments.map((doc) => (
    //               <DocumentCard doc={doc} key={doc._id} setError={setError} setMessage={setMessage} setOwnedDocuments={setOwnedDocuments} ownedDocuments={ownedDocuments} isCollaboratedDoc={false} />
    //               // <li key={doc._id} className="bg-gray-100 dark:bg-[#383b40] px-4 py-3 rounded-lg shadow hover:shadow-md transition flex justify-between items-center">
    //               //   <div>
    //               //     <Link to={`/documents/${doc._id}`} className="text-blue-600 hover:underline dark:text-blue-400">
    //               //       {doc.title || 'Untitled Document'}
    //               //     </Link>
    //               //     <span className="text-sm text-gray-500 ml-2">(Owner)</span>
    //               //   </div>
    //               //   <button
    //               //     onClick={() => handleDeleteDocument(doc._id)}
    //               //     className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs"
    //               //   >
    //               //     Delete
    //               //   </button>
    //               // </li>
    //             ))}
    //           </div>
    //         </div>
    //       )}

    //       {collaboratedDocuments.length > 0 && (
    //         <div>
    //           <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">🤝 Collaborated Documents</h3>
    //           <ul className="space-y-2">
    //             {collaboratedDocuments.map((doc) => (
    //               <DocumentCard doc={doc} key={doc._id} setError={setError} setMessage={setMessage} setOwnedDocuments={setCollaboratedDocuments} ownedDocuments={collaboratedDocuments} isCollaboratedDoc={true} />
    //               // <li key={doc._id} className="bg-gray-100 dark:bg-[#383b40] px-4 py-3 rounded-lg shadow hover:shadow-md transition">
    //               //   <Link to={`/documents/${doc._id}`} className="text-blue-600 hover:underline dark:text-blue-400">
    //               //     {doc.title || 'Untitled Document'}
    //               //   </Link>
    //               //   <span className="text-sm text-gray-500 ml-2">
    //               //     (Shared by <span className="font-medium">{doc.owner.username}</span>)
    //               //   </span>
    //               // </li>
    //             ))}
    //           </ul>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
      <div className="min-h-screen mt-16 bg-gradient-to-br from-[#2E8BC0] via-[#0C2D48] to-gray-900 text-white transition-all duration-500">
        <div className="max-w-5xl mx-auto px-6 py-14">
          
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row gap-8 items-center bg-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-xl border border-white/20 mb-10">
            {user.avatar ? (
              <img src="/profile-pic.jpg" alt="avatar" className="w-32 h-32 rounded-full object-cover shadow-lg" />
            ) : (
              <img src={assets.user_icon} alt="default icon" className="w-32 h-32 rounded-full object-cover shadow-lg" />
            )}
            <div>
              <h1 className="text-3xl font-bold uppercase text-white tracking-wide">{user.username}</h1>
              <p className="text-gray-300 text-lg mt-1">{user.email}</p>
            </div>
          </div>
    
          {/* Notification messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-4 shadow">
              ⚠️ {error}
            </div>
          )}
          {message && (
            <div className="bg-green-500/20 border border-green-500 text-green-200 p-4 rounded-lg mb-4 shadow">
              ✅ {message}
            </div>
          )}
    
          {/* Create new document */}
          <div className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">📄 Create New Document</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter new document title..."
                value={newDocumentTitle}
                onChange={(e) => setNewDocumentTitle(e.target.value)}
              />
              <button
                onClick={handleCreateNewDocument}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
              >
                ➕ Create
              </button>
            </div>
          </div>
    
          {/* Owned Documents */}
          {ownedDocuments.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-white mb-4">📘 Owned Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ownedDocuments.map((doc) => (
                  <DocumentCard
                    doc={doc}
                    key={doc._id}
                    setError={setError}
                    setMessage={setMessage}
                    setOwnedDocuments={setOwnedDocuments}
                    ownedDocuments={ownedDocuments}
                    isCollaboratedDoc={false}
                  />
                ))}
              </div>
            </div>
          )}
    
          {/* Collaborated Documents */}
          {collaboratedDocuments.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">🤝 Collaborated Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {collaboratedDocuments.map((doc) => (
                  <DocumentCard
                    doc={doc}
                    key={doc._id}
                    setError={setError}
                    setMessage={setMessage}
                    setOwnedDocuments={setCollaboratedDocuments}
                    ownedDocuments={collaboratedDocuments}
                    isCollaboratedDoc={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    
  );
}

export default Dashboard;