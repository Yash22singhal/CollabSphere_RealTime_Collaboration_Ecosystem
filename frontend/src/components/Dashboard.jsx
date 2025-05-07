import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faL } from "@fortawesome/free-solid-svg-icons";
import DocumentCard from "./DocumentCard";
import { assets } from "../assets/data";
import { docTypes } from "../assets/data";

function Dashboard() {
  const [ownedDocuments, setOwnedDocuments] = useState([]);
  const [collaboratedDocuments, setCollaboratedDocuments] = useState([]);
  const [newDocumentTitle, setNewDocumentTitle] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { url, token, user } = useContext(AppContext);
  const [isCreateDoc, setIsCreateDoc] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [typeOfDoc, setTypeOfDoc] = useState('');
  //const url = "https://collabsphere-realtime-collaboration.onrender.com"

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");
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
          setError(errorData?.message || "Failed to fetch documents.");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred while fetching documents.");
      }
    };

    fetchDocuments();
  }, []);

  const handleCreateNewDocument = async () => {
    console.log(typeOfDoc);
    
    setIsModalVisible(false);
    setError("");
    setMessage("");

    if (!newDocumentTitle.trim()) {
      setError("Please enter a title for the new document.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${url}/api/documents/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newDocumentTitle, type: typeOfDoc }),
      });

      const data = await response.json();

      if (response.ok) {
        setOwnedDocuments([...ownedDocuments, data]);
        setMessage("🎉 Document created successfully!");
        setNewDocumentTitle("");
      } else {
        setError(data.message || "Failed to create document.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while creating the document.");
    }
  };

  const handleCreateDoc = (type) => {
    setTypeOfDoc(type);
    setIsModalVisible(true);
  };

  return (
    <>
      {isModalVisible && (
        // <div className="absolute z-[1] w-full h-full bg-black/60 grid">
        //   <div className="place-self-center w-[min(100%,_23vw)] min-w-[330px] text-gray-500 bg-white flex flex-col gap-[25px] p-[25px_30px] rounded-[8px] text-[14px] animate-fadeIn">
        //     <h2 className="text-2xl font-semibold mb-4">
        //       📄 Create New Document
        //     </h2>
        //     <div className="flex flex-col sm:flex-row gap-4">
        //       <input
        //         type="text"
        //         className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        //         placeholder="Enter new document title..."
        //         value={newDocumentTitle}
        //         onChange={(e) => setNewDocumentTitle(e.target.value)}
        //       />
        //       <button
        //         onClick={handleCreateNewDocument}
        //         className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
        //       >
        //         ➕ Create
        //       </button>
        //     </div>
        //   </div>
        // </div>
        <div className="absolute z-[1] w-full h-full bg-black/60 grid">
  <div className="place-self-center w-[min(100%,23vw)] sm:w-[min(100%,30vw)] lg:w-[min(100%,40vw)] min-w-[330px] text-gray-500 bg-white flex flex-col gap-6 p-6 rounded-lg text-sm animate-fadeIn">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold mb-4">
        📄 Create New {typeOfDoc} Document
      </h2>
      <button
        className="cursor-pointer text-xl font-extrabold text-gray-500 hover:text-gray-700"
        onClick={() => setIsModalVisible(false)}
        aria-label="Close"
      >
        ✕
      </button>
    </div>
    <div className="flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/10 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter new document title..."
        value={newDocumentTitle}
        onChange={(e) => setNewDocumentTitle(e.target.value)}
      />
      <button
        onClick={() => handleCreateNewDocument(typeOfDoc)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
      >
        ➕ Create
      </button>
    </div>
  </div>
</div>

      )}
      <div className="min-h-screen mt-16 bg-gradient-to-br from-[#2E8BC0] via-[#0C2D48] to-gray-900 text-white transition-all duration-500">
        <div className="max-w-5xl mx-auto px-6 py-14">
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row gap-8 items-center bg-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-xl border border-white/20 mb-10">
            {user.avatar ? (
              <img
                src="/profile-pic.jpg"
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover shadow-lg"
              />
            ) : (
              <img
                src={assets.user_icon}
                alt="default icon"
                className="w-32 h-32 rounded-full object-cover shadow-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold uppercase text-white tracking-wide">
                {user.username}
              </h1>
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
          {/* <div className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg mb-8">
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
          </div> */}
          <div className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              📄 Create New Document
            </h2>
            <div className="flex flex-row gap-4">
              <div
                className="flex flex-col items-center justify-center bg-white/10 py-2 px-5 rounded-2xl border border-white/20 shadow-lg cursor-pointer"
                onClick={() => setIsCreateDoc(!isCreateDoc)}
              >
                <img src={assets.new_doc} alt="" className="w-16" />
                <p className="text-lg font-semibold ">Create</p>
                <p className="text-lg font-semibold ">Document</p>
              </div>
              {isCreateDoc ? (
                docTypes.map((type, id) => (
                  <div
                    key={id}
                    className="flex flex-col items-center justify-center bg-white/10 py-2 px-5 rounded-2xl border border-white/20 shadow-lg cursor-pointer"
                    onClick={() => handleCreateDoc(type.type)}
                  >
                    <img src={type.logo} alt="" className="w-16" />
                    <p className="text-lg font-semibold ">{type.type}</p>
                    <p className="text-lg font-semibold ">Document</p>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>

          {/* Owned Documents */}
          {ownedDocuments.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-white mb-4">
                📘 Owned Documents
              </h3>
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
              <h3 className="text-xl font-semibold text-white mb-4">
                🤝 Collaborated Documents
              </h3>
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
    </>
  );
}

export default Dashboard;
