import React, { useState } from "react";
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaEnvelope,
  FaCopy,
  FaCheck,
  FaShareAlt,
} from "react-icons/fa";

const ShareButton = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="text-green-500" />,
      link: `https://wa.me/?text=${encodeURIComponent(url)}`,
    },
    {
      name: "Telegram",
      icon: <FaTelegramPlane className="text-blue-400" />,
      link: `https://t.me/share/url?url=${encodeURIComponent(url)}`,
    },
    {
      name: "Email",
      icon: <FaEnvelope className="text-yellow-500" />,
      link: `mailto:?subject=Check%20this%20out&body=${encodeURIComponent(url)}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="relative group inline-block">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
        <FaShareAlt />
        Share
      </button>

      <div className="absolute z-10 hidden group-hover:flex flex-col bg-white dark:bg-[#2a2a2a] text-black dark:text-white border dark:border-white/10 border-gray-300 rounded-lg p-2 mt-2 shadow-md min-w-[180px]">
        {shareOptions.map((option) => (
          <a
            key={option.name}
            href={option.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition"
          >
            {option.icon}
            <span>{option.name}</span>
          </a>
        ))}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition w-full text-left"
        >
          {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
};

export default ShareButton;
