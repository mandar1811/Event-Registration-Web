import { useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navRef = useRef();

  // Get token dynamically so it updates with login/logout
  const access_token = localStorage.getItem("access_token");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm relative z-50">
      <div className="w-[90%] mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-purple-600" />
          <Link 
            to={"/"} 
            className="font-bold text-xl relative overflow-hidden"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              EventHub
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
          </Link>
        </div>
        {/* Desktop Navigation */}

        <div className="hidden md:flex space-x-8">
          <Link to="/allEvents" className="text-gray-600 hover:text-purple-600">
            All Events
          </Link>
          {access_token && (
            <Link to="/profile" className="text-gray-600 hover:text-purple-600">
              My Profile
            </Link>
          )}
        </div>

        {/* Auth Button (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {access_token ? (
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/register"
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Sign Up
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-600 hover:text-purple-600 focus:outline-none" 
          onClick={toggleSidebar}
        >
          <FaBars className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        ref={navRef}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span className="font-bold text-lg text-gray-800">EventHub</span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col p-4">
          <Link 
            to="/allEvents"
            className="py-3 text-gray-600 hover:text-purple-600 border-b"
            onClick={toggleSidebar}
          >
            All Events
          </Link>
          {access_token && (
            <Link 
              to="/profile"
              className="py-3 text-gray-600 hover:text-purple-600 border-b"
              onClick={toggleSidebar}
            >
              My Profile
            </Link>
          )}

          <div className="mt-6">
            {access_token ? (
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/register"
                className="w-full px-4 py-2 text-sm bg-purple-600 text-white text-center block rounded-md hover:bg-purple-700"
                onClick={toggleSidebar}
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
