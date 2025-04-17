import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CollabSphere
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Features
              </a>
              <a
                href="#demo"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Demo
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Testimonials
              </a>
              <button className="px-6 py-2 text-white bg-blue-600 !rounded-button hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                Get Started
              </button>
            </div>
            <button
              className="md:hidden cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className="text-gray-600 text-xl"><FontAwesomeIcon icon={faBars} /></i>
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white z-40 border-b border-gray-100">
          <div className="px-4 py-2 space-y-2">
            <a
              href="#features"
              className="block py-2 text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Features
            </a>
            <a
              href="#demo"
              className="block py-2 text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Demo
            </a>
            <a
              href="#testimonials"
              className="block py-2 text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Testimonials
            </a>
            <button className="w-full px-6 py-2 text-white bg-blue-600 !rounded-button hover:bg-blue-700 cursor-pointer whitespace-nowrap">
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
