import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

function AISideChat({ selectedText, onApply, setIsAISideChatOpen }) {
  const [activeTab, setActiveTab] = useState("summarize");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { url } = useContext(AppContext);
  const [inputValue, setInputValue] = useState("");
  //const url = "https://collabsphere-realtime-collaboration.onrender.com"

  useEffect(() => {
    setInputValue(selectedText || "");
  }, [selectedText]);

  useEffect(() => {
    // Reset response when selectedText changes
    setAiResponse("");
  }, [selectedText]);

  const handleAiAction = async (action) => {
    let searchData = "";
    if (!selectedText && inputValue == "") {
      setAiResponse("Please select text in the editor first.");
      return;
    } else if (inputValue != "") {
      searchData = inputValue;
    } else {
      searchData = selectedText;
    }

    setLoading(true);
    setAiResponse("Processing...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAiResponse("Authentication error.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${url}/api/ai/process`, {
        // Replace with your actual backend endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: action,
          text: searchData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.response); // Use 'response' to match backend
      } else {
        const errorData = await response.json();
        setAiResponse(`Error: ${errorData.message || "Something went wrong"}`);
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
      setAiResponse("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    setInputValue(selectedText || "");
  }, [selectedText]);

  return (
    <div className="bg-white shadow-md rounded-md p-4 min-w-64">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-900">
          AI Assistant
        </h2>
        {/* <h2 className='cursor-pointer' onClick={()=>setIsAISideChatOpen(false)}>X</h2> */}
        <button className="cursor-pointer font-bold" onClick={() => setIsAISideChatOpen(false)} aria-label="Close">
          ✕
        </button>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-700">
          Selected Text:
        </p>
        <input
          type="text"
          name="text"
          id="text"
          value={inputValue}
          onChange={handleInputChange}
          className="border border-gray-500 w-full text-black"
        />
        {/* <p className="text-gray-800 italic dark:text-gray-300">{selectedText || 'No text selected'}</p> */}
      </div>

      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => setActiveTab("summarize")}
          className={`px-3 py-1 rounded-md text-sm ${
            activeTab === "summarize"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-300 dark:hover:bg-blue-700 transition"
          }`}
        >
          Summarize
        </button>
        <button
          onClick={() => setActiveTab("suggest")}
          className={`px-3 py-1 rounded-md text-sm ${
            activeTab === "suggest"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-300 dark:hover:bg-blue-700 transition"
          }`}
        >
          Suggest
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-3 py-1 rounded-md text-sm ${
            activeTab === "chat"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-300 dark:hover:bg-blue-700 transition"
          }`}
        >
          Chat
        </button>
        {/* Add more tabs as needed */}
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => handleAiAction(activeTab)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Processing..." : "Go!"}
        </button>
      </div>

      <div className="flex-grow max-h-64 overflow-auto">
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
