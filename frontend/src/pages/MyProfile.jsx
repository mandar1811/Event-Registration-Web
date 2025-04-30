import React, { useEffect, useState } from "react";
import axios from "axios";
import EventGrid from "../components/EventGrid";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MyProfile = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [username] = useState(localStorage.getItem("username"));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get("http://localhost:5000/my-registrations", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching registrations", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = (eventId) => {
    setEventToDelete(eventId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:5000/registrations/${eventToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowModal(false);
      setEventToDelete(null);
      fetchRegistrations();
    } catch (error) {
      alert("Error deleting registration.");
      console.error(error);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-[90%] md:w-[85%] mx-auto "
    >
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg mb-10">
        <div className="px-8 py-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Welcome back, {username || "Guest"} 👋
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-indigo-100"
          >
            Manage your event registrations and discover new opportunities
          </motion.p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Your Registrations
          </h2>
          <button
            onClick={() => navigate("/allevents")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Browse More Events
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : events.length > 0 ? (
          <EventGrid events={events} onDelete={handleCancelClick} />
        ) : (
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100"
          >
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Registrations Found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't registered for any events yet. Explore our catalog and find something that interests you!
            </p>
            <button
              onClick={() => navigate("/allevents")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              Discover Events
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Modal with animation */}
      {showModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-md"
          >
            <div className="bg-red-50 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-center text-gray-800">Cancel Registration</h2>
            <p className="mb-6 text-gray-600 text-center">
              Are you sure you want to cancel this registration? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEventToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-medium text-gray-700 transition-all duration-200"
              >
                Keep Registration
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Yes, Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyProfile;
