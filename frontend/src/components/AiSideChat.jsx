// // AISideChat.js
// import React, { useState, useEffect } from 'react';

// function AISideChat({ selectedText, onApply }) {
//   const [activeTab, setActiveTab] = useState('summarize');
//   const [aiResponse, setAiResponse] = useState('');
//   const [loading, setLoading] = useState(false);

//   console.log(selectedText);

//   useEffect(() => {
//     // Reset response when selectedText changes
//     setAiResponse('');
//   }, [selectedText]);

//   const handleAction = async (action) => {
//     if (!selectedText) {
//       alert('Please select text in the editor first.');
//       return;
//     }

//     setLoading(true);
//     setAiResponse('Processing...');

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:5000/api/ai/process', { // Replace with your actual backend endpoint
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           action: action,
//           text: selectedText,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setAiResponse(data.result); // Assuming your backend returns the result in a 'result' field
//       } else {
//         const errorData = await response.json();
//         setAiResponse(`Error: ${errorData.message || 'Something went wrong'}`);
//       }
//     } catch (error) {
//       setAiResponse(`Error: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApply = () => {
//     if (aiResponse && onApply) {
//       onApply(aiResponse);
//       setAiResponse(''); // Clear the response after applying
//     }
//   };

//   return (
//     <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-md w-64">
//       <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">AI Assistant</h2>
//       <div className="flex space-x-2 mb-2">
//         <button
//           onClick={() => setActiveTab('summarize')}
//           className={`px-3 py-1 rounded-md text-sm ${
//             activeTab === 'summarize'
//               ? 'bg-blue-500 text-white'
//               : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-300 dark:hover:bg-blue-700 transition'
//           }`}
//         >
//           Summarize
//         </button>
//         <button
//           onClick={() => setActiveTab('suggest')}
//           className={`px-3 py-1 rounded-md text-sm ${
//             activeTab === 'suggest'
//               ? 'bg-blue-500 text-white'
//               : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-300 dark:hover:bg-blue-700 transition'
//           }`}
//         >
//           Suggest
//         </button>
//         {/* Add more tabs as needed */}
//       </div>

//       {loading && <p className="text-gray-600 dark:text-gray-400 italic">Processing...</p>}

//       {aiResponse && (
//         <div className="mt-4 p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm">
//           <p>{aiResponse}</p>
//         </div>
//       )}

//       {aiResponse && !loading && (
//         <button
//           onClick={handleApply}
//           className="mt-4 px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition text-sm"
//         >
//           Apply
//         </button>
//       )}
//     </div>
//   );
// }

// export default AISideChat;













import React, { useState, useEffect } from 'react';

function AISideChat({ selectedText, onApply }) {
  const [activeTab, setActiveTab] = useState('summarize');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const url = "https://collabsphere-realtime-collaboration.onrender.com"

  useEffect(() => {
    // Reset response when selectedText changes
    setAiResponse('');
  }, [selectedText]);

  const handleAiAction = async (action) => {
    if (!selectedText) {
      setAiResponse('Please select text in the editor first.');
      return;
    }

    setLoading(true);
    setAiResponse('Processing...');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAiResponse('Authentication error.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${url}/api/ai/process`, { // Replace with your actual backend endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: action,
          text: selectedText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.response); // Use 'response' to match backend
      } else {
        const errorData = await response.json();
        setAiResponse(`Error: ${errorData.message || 'Something went wrong'}`);
      }
    } catch (error) {
      setAiResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (aiResponse && onApply) {
      onApply(aiResponse);
      setAiResponse('');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 w-64">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">AI Assistant</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Selected Text:</p>
        <p className="text-gray-800 italic dark:text-gray-300">{selectedText || 'No text selected'}</p>
      </div>

      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => setActiveTab('summarize')}
          className={`px-3 py-1 rounded-md text-sm ${
            activeTab === 'summarize'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-300 dark:hover:bg-blue-700 transition'
          }`}
        >
          Summarize
        </button>
        <button
          onClick={() => setActiveTab('suggest')}
          className={`px-3 py-1 rounded-md text-sm ${
            activeTab === 'suggest'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-300 dark:hover:bg-blue-700 transition'
          }`}
        >
          Suggest
        </button>
        {/* Add more tabs as needed */}
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => handleAiAction(activeTab)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Go!'}
        </button>
      </div>

      <div className="flex-grow overflow-auto">
        <p className="text-gray-900 dark:text-gray-900">{aiResponse}</p>
      </div>

      {aiResponse && !loading && (
        <div className="mt-4">
          <button
            onClick={handleApply}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}

export default AISideChat;