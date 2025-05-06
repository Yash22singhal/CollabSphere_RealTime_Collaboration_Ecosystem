// import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import { assets } from "../assets/data";
// import { AppContext } from "../context/AppContext";

// const DocumentCard = ({ doc, setError, setMessage, setOwnedDocuments, ownedDocuments, isCollaboratedDoc }) => {

//   const {url} = useContext(AppContext);
//   const created = new Date(doc.createdAt);
//   const createdDate = created.getDate() + '/' + created.getMonth() + '/' + created.getFullYear();

//   const handleDeleteDocument = async (documentId) => {
//     setError("");
//     setMessage("");
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const response = await fetch(`${url}/api/documents/${documentId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setOwnedDocuments(
//           ownedDocuments.filter((doc) => doc._id !== documentId)
//         );
//         setMessage("Document deleted successfully!");
//       } else {
//         setError(data.message || "Failed to delete document.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("An unexpected error occurred while deleting the document.");
//     }
//   };



//   return (
//     <div className="rounded-lg border border-gray-500 shadow-2xl p-5 bg-[#00000018]">
//       <div className="flex items-center gap-5">
//         <img src={assets.doc_icon} alt="" className="w-20" />
//         <div>
//           <Link to={`/documents/${doc._id}`} className="text-white font-semibold text-xl">{doc.title}</Link>
//           <p className="text-gray-300">created: <span className="text-gray-400">{createdDate}</span></p>
//         </div>
//       </div>
//       {isCollaboratedDoc ? <></> :
//         <div className="flex justify-end mt-2">
//           <button
//             onClick={() => handleDeleteDocument(doc._id)}
//             className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
//           >
//             Delete
//           </button>
//         </div>
//       }
//     </div>
//   );
// };

// export default DocumentCard;



import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/data";
import { AppContext } from "../context/AppContext";

const DocumentCard = ({
  doc,
  setError,
  setMessage,
  setOwnedDocuments,
  ownedDocuments,
  isCollaboratedDoc,
}) => {
  const { url } = useContext(AppContext);

  const createdDate = new Date(doc.createdAt).toLocaleDateString();

  const handleDeleteDocument = async (documentId) => {
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${url}/api/documents/${documentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOwnedDocuments(ownedDocuments.filter((d) => d._id !== documentId));
        setMessage("Document deleted successfully!");
      } else {
        setError(data.message || "Failed to delete document.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while deleting the document.");
    }
  };

  return (
    <div className="rounded-lg border border-gray-500 shadow-lg p-5 bg-black/10 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <img src={assets.doc_icon} alt="Document Icon" className="w-16" />
        <div>
          <Link
            to={`/documents/${doc._id}`}
            className="text-white font-semibold text-xl hover:underline"
          >
            {doc.title}
          </Link>
          <p className="text-gray-300">
            Created: <span className="text-gray-400">{createdDate}</span>
          </p>
        </div>
      </div>

      {!isCollaboratedDoc && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => handleDeleteDocument(doc._id)}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
