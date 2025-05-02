import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // "success" or "error"

  // Handle popup close after a certain time
  useEffect(() => {
    let timer;
    if (showPopup) {
      timer = setTimeout(() => {
        setShowPopup(false);
        if (popupType === "success") {
          // Navigate after success popup disappears
          const isAdmin = localStorage.getItem("is_admin") === "1";
          navigate(isAdmin ? "/dashboard" : "/");
        }
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showPopup, popupType, navigate]);

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      console.log(res);
      let access_token = res.data.access_token;
      let is_admin = res.data.is_admin;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("is_admin", is_admin);
      
      // Show success popup
      setPopupType("success");
      setPopupMessage("Login successful! Redirecting...");
      setShowPopup(true);
      
      // Note: Navigation is handled in the useEffect above
      
    } catch (error) {
      console.log("Login failed");
      setShake(true);
      setTimeout(() => setShake(false), 500); // Trigger shake animation
      
      // Show error popup
      setPopupType("error");
      setPopupMessage("Login failed. Please check your credentials.");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  // Popup component with improved styling and animation
  const Popup = ({ type, message }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 animate-fadeIn">
        <div className={`px-6 py-4 rounded-lg shadow-xl ${type === "success" ? "bg-green-50" : "bg-red-50"} max-w-sm w-full mx-4 animate-slideDown`}>
          <div className="flex items-center">
            {type === "success" ? (
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-green-100 animate-pulse">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            ) : (
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-red-100 animate-pulse">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            )}
            <div className="ml-4">
              <h3 className={`text-lg font-medium ${type === "success" ? "text-green-800" : "text-red-800"}`}>
                {type === "success" ? "Success" : "Error"}
              </h3>
              <p className={`text-sm ${type === "success" ? "text-green-700" : "text-red-700"}`}>
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Display popup if showPopup is true */}
      {showPopup && <Popup type={popupType} message={popupMessage} />}
      
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl transform transition duration-500 hover:scale-[1.01] animate-fadeIn">
          {/* Left Image Section */}
          <div className="hidden md:block w-1/2 bg-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90"></div>
            <div className="h-full flex items-center justify-center p-8 relative z-10">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-6">Welcome Back!</h2>
                <img
                  src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                  alt="Login Illustration"
                  className="max-h-64 max-w-full object-contain animate-float"
                />
                <p className="text-white text-opacity-90 mt-6 italic">
                  "Sign in to access your personalized dashboard and continue your journey with us."
                </p>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-indigo-500 opacity-20"></div>
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-purple-500 opacity-20"></div>
          </div>
          
          {/* Right Form Section */}
          <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 animate-fadeInUp">Sign In</h1>
              <p className="text-gray-600 mt-2">Please enter your credentials to continue</p>
            </div>
            
            <form onSubmit={loginUser} className={`space-y-6 ${shake ? "animate-shake" : ""}`}>
              <div className="transform transition duration-300 hover:translate-y-px">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
              </div>
              
              <div className="transform transition duration-300 hover:translate-y-px">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 transform hover:translate-y-px hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="flex items-center justify-between mt-4 hidden">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
              </div>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-800 transition underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Login;
