import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faChevronDown,
  faSignOutAlt,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";

function UserMenu({ user, logout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative inline-block text-left"
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <FontAwesomeIcon icon={faUserCircle} className="text-xl" />
        <span className="hidden sm:inline capitalize">Hello, {user && user.username ? ` ${user.username}` : ""}</span>
        <FontAwesomeIcon icon={faChevronDown} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-0.5 w-40 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 z-20">
          <a
            href="/dashboard"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
            Dashboard
          </a>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
