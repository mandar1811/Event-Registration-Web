import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronRight,
  Award
} from "lucide-react";

const EventCard = ({ event, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/event/${event.id || event.event_id}`);
  };

  const handleCancel = (e) => {
    e.stopPropagation(); // prevent card click
    onDelete(event.id || event.event_id);
  };

  const getBadgeColor = (category) => {
    const categoryColors = {
      "Conference": "from-blue-500 to-violet-600",
      "Workshops": "from-emerald-400 to-teal-600",
      "Meetups": "from-fuchsia-500 to-purple-700",
      "Festivals": "from-amber-400 to-orange-600",
    };
    return categoryColors[category] || "from-slate-400 to-slate-600";
  };

  const getPriceDisplay = (price) => {
    if (price === 0) return "Free";
    return `Rs ${price.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  const getDateParts = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return { day, month };
  };

  const { day, month } = event.date ? getDateParts(event.date) : { day: '--', month: '--' };

  return (
    <div
      onClick={handleCardClick}
      className="block group cursor-pointer"
      aria-label={`View details for ${event.title}`}
    >
      <div className="relative bg-white overflow-hidden flex flex-col h-full shadow-md border border-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:border-indigo-100">
        <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>

        <div className="flex flex-row h-full">
          <div className="w-20 bg-gray-50 flex flex-col items-center pt-4 border-r border-gray-100 transition-colors duration-300 group-hover:bg-indigo-50 group-hover:border-indigo-100">
            {event.date && (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-indigo-600 transition-transform duration-300 group-hover:scale-110">{day}</span>
                <span className="text-xs font-semibold uppercase text-gray-600">{month}</span>
                <div className="h-px w-12 bg-gray-200 my-4 transition-all duration-300 group-hover:bg-indigo-200 group-hover:w-16"></div>
              </div>
            )}
            <div className="mt-2 transform -rotate-90 origin-center whitespace-nowrap transition-all duration-300">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getBadgeColor(event.category)}`}>
                {event.category}
              </span>
            </div>
            {event.featured && (
              <div className="mt-auto mb-4 text-amber-400 transition-transform duration-300 group-hover:scale-110">
                <Award className="w-6 h-6" />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/40 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-overlay"></div>
              <div className="absolute bottom-0 left-0 w-full p-4">
                <h3 className="font-bold text-xl text-white leading-tight drop-shadow-sm transition-colors duration-300 group-hover:text-indigo-100">
                  {event.title}
                </h3>
                <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 transition-all duration-300 group-hover:w-24"></div>
              </div>
            </div>

            <div className="p-4 flex flex-col flex-grow z-10 relative">
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                {event.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {event.time && (
                  <div className="flex items-center p-2 text-sm text-gray-700 border-l-2 border-indigo-400 pl-3 group-hover:border-l-4 group-hover:bg-indigo-50">
                    <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="font-medium">{formatTime(event.time)}</span>
                  </div>
                )}
                <div className="flex items-center p-2 text-sm text-gray-700 border-l-2 border-indigo-400 pl-3 group-hover:border-l-4 group-hover:bg-indigo-50">
                  <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                  <span className="font-medium">{event.venue}</span>
                </div>
                <div className="flex items-center p-2 text-sm text-gray-700 border-l-2 border-indigo-400 pl-3 group-hover:border-l-4 group-hover:bg-indigo-50">
                  <Users className="h-4 w-4 mr-2 text-indigo-500" />
                  <span className="font-medium">Capacity: {event.capacity}</span>
                </div>
                <div className="flex items-center p-2 text-sm text-gray-700 border-l-2 border-indigo-400 pl-3 group-hover:border-l-4 group-hover:bg-indigo-50">
                  <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                {event.organizer && (
                  <div className="flex flex-col text-gray-700">
                    <span className="text-xs text-gray-500">Organized by</span>
                    <span className="text-sm font-medium group-hover:text-indigo-600">
                      {event.organizer}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  {onDelete && (
                    <button
                      onClick={handleCancel}
                      className="bg-red-500 text-white px-3 py-1.5 text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      Cancel Registration
                    </button>
                  )}
                  <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-md group-hover:bg-indigo-100 group-hover:shadow-md transition">
                    <span
                      className={`text-lg font-semibold ${
                        event.price === 0 ? "text-emerald-600" : "text-indigo-600"
                      }`}
                    >
                      {getPriceDisplay(event.price)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
