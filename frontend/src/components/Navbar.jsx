import React, { useContext, useEffect, useState } from "react";
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
import { AppContext } from "../context/AppContext";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const { isAuthenticated, token, setToken, url } = useContext(AppContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  //const token = localStorage.getItem("token");

  function isTokenValid(token) {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (err) {
      return false;
    }
  }

  const fetchUser = async (token) => {
        if (!token) return;
        const userId = localStorage.getItem('userId');
        try{
            const response = await fetch(`${url}/api/auth/user/${userId}`,{
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userData = await response.json();

            if (response.ok){
                setUser(userData);
                
            }

        } catch(error){
            console.log(error);
        }
    }

  useEffect(() => {
    fetchUser(localStorage.getItem('token'));
  }, [token])
  

  const isLoggedIn = isTokenValid(token);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      {/* Top Navbar */}
      <nav className="h-16 fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <a href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CollabSphere
              </span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated() && (
                <a
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faUser} />
                  Dashboard
                </a>
              )}
              <a
                href="/#features"
                className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faRocket} />
                Features
              </a>
              <a
                href="/#demo"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Demo
              </a>
              <a
                href="/#testimonials"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Testimonials
              </a>
              {/* {isAuthenticated() ? (
                <button 
                  onClick={logout}
                  className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              ) : (
                <a
                  href="/signup"
                  className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Get Started
                </a>
              )} */}
              {isAuthenticated() ? (
                (
                user && user.username ? (
                  <UserMenu user={user} logout={logout} />
                ) : (
                  <div className="px-5 py-2 cursor-pointer">
                    <FontAwesomeIcon icon={faUser} size="lg" />
                  </div>
                )
              )
              ) : (
                <a
                  href="/signup"
                  className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Get Started
                </a>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-600 text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
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
            className="md:hidden fixed top-16 left-0 right-0 bg-white z-40 border-b border-gray-200 shadow"
          >
            <div className="px-4 py-4 space-y-3">
              {isAuthenticated() && (
                <a
                  href="/dashboard"
                  className=" text-gray-700 hover:text-blue-600 flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faUser} />
                  Dashboard
                </a>
              )}
              <a
                href="/#features"
                className=" text-gray-700 hover:text-blue-600 flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faRocket} />
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
              {isAuthenticated() ? (
                <button
                  onClick={logout}
                  className="w-full text-left text-white bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              ) : (
                <a
                  href="/signup"
                  className="block text-center text-white bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
