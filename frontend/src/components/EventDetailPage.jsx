import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TicketFormModal from "./TicketFormModal";

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const [events, setEvents] = useState([]);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch event data
  const getData = async (id) => {
    const res = await axios.get(`http://localhost:5000/event/${id}`);
    setEvent(res.data);
  };

  const getAllEvent = async () => {
    const res = await axios.get("http://localhost:5000/events");
    setEvents(res.data);
  };

  useEffect(() => {
    getData(id);
    getAllEvent();
  }, [id]);

  // Get category badge color
  const getBadgeColor = (category) => {
    const categoryColors = {
      Conference: "bg-blue-100 text-blue-800",
      Workshops: "bg-green-100 text-green-800",
      Meetups: "bg-purple-100 text-purple-800",
      Festivals: "bg-orange-100 text-orange-800",
    };

    return categoryColors[category] || "bg-gray-100 text-gray-800";
  };

  const getPriceColor = (price) => {
    if (price === 0 || price === "Free") return "text-green-600";
    return "text-blue-600";
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!event || Object.keys(event).length === 0) {
    return (
      <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to events list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto">
      {/* Header */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link to="/" className="text-blue-600 hover:underline">
              &larr; Back to Events
            </Link>
          </div>
        </div>
      </header>

      {/* Event Detail Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="w-full lg:w-1/2">
            <div className="mb-4">
              <h1 className="text-3xl font-bold">{event.title}</h1>
            </div>

            <div className="flex items-center gap-3 my-4">
              <span
                className={`text-xl font-semibold text-green-600 ${getPriceColor(
                  event.price
                )}`}
              >
                {event.price == 0 ? "Free" : "Rs" + event.price}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 ${getBadgeColor(
                  event.category
                )}`}
              >
                {event.category}
              </span>
            </div>

            <div className="mb-6">
              <button
                onClick={() => setShowTicketForm(true)}
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition duration-200"
              >
                Get Ticket
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-red-400 mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <span className="block text-gray-800">{formatDate(event.date)}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-red-400 mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <span className="block text-gray-800">{event.venue}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-red-400 mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <span className="block text-gray-800">
                    Capacity: {event.capacity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Description */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">About This Event:</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {event.description}
          </p>
        </div>

        {/* Related Events */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events
              .filter((e) => e.id !== parseInt(id) && e.category === event.category)
              .slice(0, 3)
              .map((relatedEvent) => (
                <Link
                  key={relatedEvent.id}
                  to={`/event/${relatedEvent.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-duration-300">
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={relatedEvent.image_url}
                        alt={relatedEvent.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">
                        {relatedEvent.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {relatedEvent.date ? formatDate(relatedEvent.date) : ''}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
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