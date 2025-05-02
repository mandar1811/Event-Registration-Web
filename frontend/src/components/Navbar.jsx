import { useRef, useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Calendar } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const navbarHeight = useRef(0);
  const access_token = localStorage.getItem("access_token");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) setIsSidebarOpen(false);
  }, [location.pathname, isSidebarOpen]);

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navRef.current) {
        const height = navRef.current.offsetHeight;
        navbarHeight.current = height;
        document.documentElement.style.setProperty("--navbar-height", `${height}px`);
      }
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    if (!document.getElementById("navbar-padding-style")) {
      const style = document.createElement("style");
      style.id = "navbar-padding-style";
      style.innerHTML = `
        body {
          padding-top: var(--navbar-height, 80px);
        }
      `;
      document.head.appendChild(style);
    }

    const timeoutId = setTimeout(updateNavbarHeight, 100);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
      clearTimeout(timeoutId);
    };
  }, [navRef, navbarHeight]);

  if (isAdminPage) return null;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-white/90 backdrop-blur-sm py-4"
      }`}
      ref={navRef}
    >
      <div className="w-[90%] mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2 group">
          <div className="bg-purple-100 p-2 rounded-full transition-all duration-300 group-hover:bg-purple-200">
            <Calendar className="h-6 w-6 text-purple-600 transition-all duration-300 group-hover:scale-110" />
          </div>
          <Link to="/" className="font-bold text-xl group relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300">
              EventHub
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
          </Link>
        </div>

        <div className="hidden md:flex space-x-8">
          <Link
            to="/allEvents"
            className={`text-gray-600 hover:text-purple-600 relative transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-600 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${
              location.pathname === "/allEvents" ? "text-purple-600 after:scale-x-100" : ""
            }`}
          >
            Explore Events
          </Link>
          {access_token && (
            <Link
              to="/profile"
              className={`text-gray-600 hover:text-purple-600 relative transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-600 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                location.pathname === "/profile" ? "text-purple-600 after:scale-x-100" : ""
              }`}
            >
              My Profile
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {access_token ? (
            <button
              onClick={logout}
              className="px-6 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
            >
              Logout
            </button>
          ) : (
            <div className="flex space-x-3">
              <Link
                to="/login"
                className="px-5 py-2 text-sm text-purple-600 border border-purple-600 rounded-full transition-all duration-300 hover:bg-purple-50 hover:shadow-md"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-1 hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-gray-600 hover:text-purple-600 focus:outline-none transition-all duration-300 hover:scale-110"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <FaBars className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-500 ${
          isSidebarOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Content */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-2 group">
            <div className="bg-purple-100 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              EventHub
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 transition-all duration-300 hover:rotate-90 focus:outline-none"
            aria-label="Close menu"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col p-6 space-y-4">
          <Link
            to="/allEvents"
            className={`py-3 text-gray-600 hover:text-purple-600 border-b hover:pl-2 transition-all duration-300 ${
              location.pathname === "/allEvents" ? "text-purple-600 font-medium" : ""
            }`}
            onClick={toggleSidebar}
          >
            Explore Events
          </Link>
          {access_token && (
            <Link
              to="/profile"
              className={`py-3 text-gray-600 hover:text-purple-600 border-b hover:pl-2 transition-all duration-300 ${
                location.pathname === "/profile" ? "text-purple-600 font-medium" : ""
              }`}
              onClick={toggleSidebar}
            >
              My Profile
            </Link>
          )}

          <div className="mt-8 space-y-4">
            {access_token ? (
              <button
                onClick={logout}
                className="w-full px-4 py-3 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full px-4 py-3 text-sm text-purple-600 border border-purple-600 text-center block rounded-full transition-all duration-300 hover:bg-purple-50 hover:shadow-md"
                  onClick={toggleSidebar}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full px-4 py-3 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center block rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={toggleSidebar}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
