// import React, {useState} from "react";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faBars} from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const Navbar = () => {

//     const navigate = useNavigate();
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     const token = localStorage.getItem('token');

//     const logout = () => {
//       localStorage.removeItem("token");
//       navigate("/");
//     }

//   return (
//     <div>
//       {/* Navigation */}
//       <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex items-center justify-between h-16">
//             <a href="/"><div className="flex items-center cursor-pointer">
//               <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 CollabSphere
//               </span>
//             </div></a>
//             <div className="hidden md:flex items-center space-x-8">
//               {
//                 token ? 
//                 <a
//                 href="/dashboard"
//                 className="text-gray-600 hover:text-gray-900 cursor-pointer"
//               >
//                 Dashboard
//               </a> :
//               <></>
//               }
//               <a
//                 href="/#features"
//                 className="text-gray-600 hover:text-gray-900 cursor-pointer"
//               >
//                 Features
//               </a>
//               <a
//                 href="#demo"
//                 className="text-gray-600 hover:text-gray-900 cursor-pointer"
//               >
//                 Demo
//               </a>
//               <a
//                 href="#testimonials"
//                 className="text-gray-600 hover:text-gray-900 cursor-pointer"
//               >
//                 Testimonials
//               </a>
//               { token ? 
//                 <a
//                   onClick={logout}
//                   className="px-6 py-2 text-white bg-blue-600 !rounded-button hover:bg-blue-700 cursor-pointer whitespace-nowrap"
//                 >
//                   Logout
//                 </a> :
//                 <a
//                   href="/signup"
//                   className="px-6 py-2 text-white bg-blue-600 !rounded-button hover:bg-blue-700 cursor-pointer whitespace-nowrap"
//                 >
//                   Get Started
//                 </a>
//               }
//             </div>
//             <button
//               className="md:hidden cursor-pointer"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               <i className="text-gray-600 text-xl">
//                 <FontAwesomeIcon icon={faBars} />
//               </i>
//             </button>
//           </div>
//         </div>
//       </nav>
//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden fixed top-16 left-0 right-0 bg-white z-40 border-b border-gray-100">
//           <div className="px-4 py-2 space-y-2">
//             <a
//               href="#features"
//               className="block py-2 text-gray-600 hover:text-gray-900 cursor-pointer"
//             >
//               Features
//             </a>
//             <a
//               href="#demo"
//               className="block py-2 text-gray-600 hover:text-gray-900 cursor-pointer"
//             >
//               Demo
//             </a>
//             <a
//               href="#testimonials"
//               className="block py-2 text-gray-600 hover:text-gray-900 cursor-pointer"
//             >
//               Testimonials
//             </a>
//             <a
//               href="/signup"
//               className="w-full px-6 py-2 text-white bg-blue-600 !rounded-button hover:bg-blue-700 cursor-pointer whitespace-nowrap"
//             >
//               Get Started
//             </a>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Navbar;











import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faRocket,
  faStar,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <a href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CollabSphere
              </span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {token && (
                <a
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faUser} /> Dashboard
                </a>
              )}
              <a
                href="/#features"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faRocket} /> Features
              </a>
              <a
                href="/#demo"
                className="text-gray-600 hover:text-gray-900"
              >
                Demo
              </a>
              <a
                href="/#testimonials"
                className="text-gray-600 hover:text-gray-900"
              >
                Testimonials
              </a>

              {token ? (
                <button
                  onClick={logout}
                  className="px-6 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              ) : (
                <a
                  href="/signup"
                  className="px-6 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition"
                >
                  Get Started
                </a>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-600 text-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-white z-40 border-b border-gray-100 shadow"
          >
            <div className="px-4 py-4 space-y-3">
              <a
                href="/#features"
                className="block text-gray-700 hover:text-blue-600"
              >
                <FontAwesomeIcon icon={faRocket} className="mr-2" />
                Features
              </a>
              <a
                href="/#demo"
                className="block text-gray-700 hover:text-blue-600"
              >
                Demo
              </a>
              <a
                href="/#testimonials"
                className="block text-gray-700 hover:text-blue-600"
              >
                Testimonials
              </a>
              {token ? (
                <button
                  onClick={logout}
                  className="w-full text-left text-white bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-700"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              ) : (
                <a
                  href="/signup"
                  className="block text-white bg-blue-600 px-6 py-2 rounded-xl text-center hover:bg-blue-700"
                >
                  Get Started
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
