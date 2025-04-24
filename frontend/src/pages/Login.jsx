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

  // Popup component
  const Popup = ({ type, message }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
        <div className={`px-6 py-4 rounded-lg shadow-lg ${type === "success" ? "bg-green-50" : "bg-red-50"} max-w-sm w-full mx-4`}>
          <div className="flex items-center">
            {type === "success" ? (
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            ) : (
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-red-100">
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Display popup if showPopup is true */}
      {showPopup && <Popup type={popupType} message={popupMessage} />}
      
     

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4 md:p-8" 
           style={{
             background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)"
           }}>
        <div className="w-full max-w-4xl flex rounded-lg overflow-hidden shadow-xl">
          {/* Left Image Section */}
          <div className="hidden md:block w-1/2 bg-white">
            <div className="h-full flex items-center justify-center p-4">
              <img
                src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                alt="Login Illustration"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
          
          {/* Right Form Section */}
          <div className="w-full md:w-1/2 bg-white p-8 md:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
              <p className="text-gray-600 mt-2 text-sm">Please enter your credentials</p>
            </div>
            
            <form onSubmit={loginUser} className={`space-y-6 ${shake ? "animate-shake" : ""}`}>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-800"
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
