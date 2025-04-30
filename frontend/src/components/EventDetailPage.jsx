import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TicketFormModal from "./TicketFormModal";
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Clock, 
  Share2, 
  Heart, 
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const [events, setEvents] = useState([]);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Event link copied to clipboard!");
    }
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
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
             backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
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
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
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
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
     }}>
      {/* Sticky Header with Backdrop Blur */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/allEvents" className="inline-flex items-center text-gray-700 hover:text-purple-600 transition-colors font-medium">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Back to Events</span>
            </Link>
            
            <div className="flex items-center space-x-3"> 
              <button 
                onClick={handleShareClick}
                className="p-2.5 rounded-full bg-white text-gray-400 border border-gray-200 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with High-Quality Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full bg-black"
        style={{ height: "65vh", minHeight: "500px", maxHeight: "700px" }}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className={`w-full h-full object-cover object-center ${imageLoaded ? '' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            style={{ filter: "brightness(0.7)" }}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${getBadgeColor(event.category)}`}>
                {event.category}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                {event.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90 mt-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{formatDate(event.date)}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{event.venue}</span>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{event.capacity} people</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            {/* About This Event */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                About This Event
              </h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                {event.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              {/* Event Features */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Event Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3 text-purple-600">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-800">Networking</h4>
                      <p className="text-sm text-gray-500 mt-1">Connect with like-minded individuals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3 text-blue-600">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-800">Full Day Event</h4>
                      <p className="text-sm text-gray-500 mt-1">Comprehensive schedule of activities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Related Events */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Related Events
                </h2>
                <Link to="/allEvents" className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center">
                  View all <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events
                  .filter((e) => e.id !== parseInt(id) && e.category === event.category)
                  .slice(0, 4)
                  .map((relatedEvent, index) => (
                    <motion.div
                      key={relatedEvent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    >
                      <Link
                        to={`/event/${relatedEvent.id}`}
                        className="flex items-center space-x-4 group"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={relatedEvent.image_url}
                            alt={relatedEvent.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {relatedEvent.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4 mr-1.5" />
                            {relatedEvent.date ? formatDate(relatedEvent.date) : ''}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
              </div>
              {events.filter((e) => e.id !== parseInt(id) && e.category === event.category).length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">No related events found</p>
                </div>
              )}
            </motion.div>
          </motion.div>
          
          {/* Right Column - Ticket and Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Ticket Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-24">
              <div className="mb-6">
                <span className="block text-sm text-gray-500 mb-1">Price</span>
                <span className={`text-3xl font-bold ${getPriceColor(event.price)}`}>
                  {event.price === 0 || event.price === "Free" ? "Free" : `₹${event.price}`}
                </span>
              </div>
              
              <button
                onClick={() => setShowTicketForm(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                Get Ticket Now
              </button>
              
              <div className="mt-6 text-center">
                <span className="text-sm text-gray-500">Limited seats available</span>
              </div>
              
              {/* Event Details */}
              <div className="mt-8 pt-6 border-t border-gray-100 space-y-6">
                <div className="flex items-start">
                  <div className="p-2 bg-red-50 rounded-lg text-red-500">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <span className="block text-sm text-gray-500">Date</span>
                    <span className="block text-gray-800 font-medium">{formatDate(event.date)}</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 bg-green-50 rounded-lg text-green-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <span className="block text-sm text-gray-500">Venue</span>
                    <span className="block text-gray-800 font-medium">{event.venue}</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <span className="block text-sm text-gray-500">Capacity</span>
                    <span className="block text-gray-800 font-medium">
                      {event.capacity} people
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ticket Form Modal */}
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
