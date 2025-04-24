import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/signup", {
        username,
        email,
        password
      });
      
      // Show success popup
      setPopup({
        show: true,
        message: "Account created successfully!",
        type: "success"
      });
      
      // Redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      console.log("failed");
      // Show error popup
      setPopup({
        show: true,
        message: error.response?.data?.message || "Registration failed. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // Close popup
  const closePopup = () => {
    setPopup({ ...popup, show: false });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Popup Notification */}
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className={`max-w-sm p-4 rounded-lg shadow-lg ${
            popup.type === "success" ? "bg-green-50" : "bg-red-50"
          }`}>
            <div className="flex items-center">
              {popup.type === "success" ? (
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-100">
                  <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  popup.type === "success" ? "text-green-800" : "text-red-800"
                }`}>
                  {popup.type === "success" ? "Success!" : "Error!"}
                </h3>
                <div className={`mt-2 text-sm ${
                  popup.type === "success" ? "text-green-700" : "text-red-700"
                }`}>
                  <p>{popup.message}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={closePopup}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  popup.type === "success"
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

  

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
                alt="Registration Illustration"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
          
          {/* Right Form Section */}
          <div className="w-full md:w-1/2 bg-white p-8 md:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
              <p className="text-gray-600 mt-2 text-sm">Register to get started</p>
            </div>
            
            <form onSubmit={registerUser} className="space-y-6">
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
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Create a password"
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
                {loading ? "Creating Account..." : "Register"}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
