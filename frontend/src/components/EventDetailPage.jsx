import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TicketFormModal from "./TicketFormModal";
import { Calendar, MapPin, Users, ArrowLeft, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const [events, setEvents] = useState([]);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fetch event data
  const getData = async (id) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/event/${id}`);
      setEvent(res.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllEvent = async () => {
    try {
      const res = await axios.get("http://localhost:5000/events");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching all events:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getData(id);
    getAllEvent();
    
    // Add Google Fonts to document head
    const linkPoppins = document.createElement('link');
    linkPoppins.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    linkPoppins.rel = 'stylesheet';
    
    const linkPlayfair = document.createElement('link');
    linkPlayfair.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap';
    linkPlayfair.rel = 'stylesheet';
    
    document.head.appendChild(linkPoppins);
    document.head.appendChild(linkPlayfair);
    
    return () => {
      document.head.removeChild(linkPoppins);
      document.head.removeChild(linkPlayfair);
    };
  }, [id]);

  // Get category badge color
  const getBadgeColor = (category) => {
    const categoryColors = {
      Conference: "bg-blue-100 text-blue-800 border-blue-200",
      Workshops: "bg-green-100 text-green-800 border-green-200",
      Meetups: "bg-purple-100 text-purple-800 border-purple-200",
      Festivals: "bg-orange-100 text-orange-800 border-orange-200",
      Concert: "bg-pink-100 text-pink-800 border-pink-200",
      Exhibition: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };

    return categoryColors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPriceColor = (price) => {
    if (price === 0 || price === "Free") return "text-emerald-600";
    return "text-blue-600";
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event || Object.keys(event).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16" 
           style={{ 
             fontFamily: "'Poppins', sans-serif",
             backgroundSize: "cover",
             backgroundPosition: "center",
           }}>
        <div className="text-center max-w-md mx-auto bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-xl">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Event not found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return to events list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: "'Poppins', sans-serif",  
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
     }}>
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-md backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            <Link to="/" className="inline-flex w-[90%] mx-auto items-center text-white hover:text-purple-200 transition-colors font-medium">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Events
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Event Detail Content */}
      <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-white/20"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Image */}
            <div className="w-full lg:w-1/2 relative overflow-hidden bg-gray-100">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <motion.div
                className="h-full"
                style={{ height: "500px" }}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={event.image_url}
                  alt={event.title}
                  className={`w-full h-full object-cover ${imageLoaded ? '' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
              </motion.div>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 lg:hidden">
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{event.title}</h1>
                <div className="flex items-center mt-2 text-white/80">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(event.date)}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="w-full lg:w-1/2 p-6 lg:p-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6"
              >
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 hidden lg:block" style={{ fontFamily: "'Playfair Display', serif" }}>{event.title}</h1>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap items-center gap-3 my-6"
              >
                <span
                  className={`text-xl font-bold ${getPriceColor(event.price)}`}
                >
                  {event.price === 0 || event.price === "Free" ? "Free" : `₹${event.price}`}
                </span>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getBadgeColor(
                    event.category
                  )}`}
                >
                  {event.category}
                </span>
                
                
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8"
              >
                <button
                  onClick={() => setShowTicketForm(true)}
                  className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Get Ticket
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-6 border-t border-gray-100 pt-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-red-50 rounded-lg text-red-500">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Date</span>
                    <span className="block text-gray-800 font-medium">{formatDate(event.date)}</span>
                  </div>
                </div>

                

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-green-50 rounded-lg text-green-500">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Venue</span>
                    <span className="block text-gray-800 font-medium">{event.venue}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">Capacity</span>
                    <span className="block text-gray-800 font-medium">
                      {event.capacity} people
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Event Description */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="w-10 h-1 bg-purple-600 rounded-full mr-3"></span>
            About This Event
          </h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {event.description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </motion.div>

        {/* Related Events */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="w-10 h-1 bg-purple-600 rounded-full mr-3"></span>
            Related Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events
              .filter((e) => e.id !== parseInt(id) && e.category === event.category)
              .slice(0, 3)
              .map((relatedEvent, index) => (
                <motion.div
                  key={relatedEvent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                >
                  <Link
                    to={`/event/${relatedEvent.id}`}
                    className="block group"
                  >
                    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 border border-white/20">
                      <div className="h-48 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                        <img
                          src={relatedEvent.image_url}
                          alt={relatedEvent.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onLoad={(e) => {
                            e.target.previousSibling.classList.add('hidden');
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <span className="font-medium">View Details</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-3 ${getBadgeColor(relatedEvent.category)}`}>
                          {relatedEvent.category}
                        </span>
                        <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-purple-600 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {relatedEvent.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {relatedEvent.date ? formatDate(relatedEvent.date) : ''}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
          {events.filter((e) => e.id !== parseInt(id) && e.category === event.category).length === 0 && (
            <div className="text-center py-10 bg-white/90 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
              <p className="text-gray-500">No related events found</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Render the ticket form modal */}
      <TicketFormModal 
        show={showTicketForm}
        setShow={setShowTicketForm}
        event={event}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}

export default EventDetailPage;
