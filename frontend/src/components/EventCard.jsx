import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronRight,
  Search,
} from "lucide-react";

const EventCard = ({ event }) => {
    const getBadgeColor = (category) => {
        const categoryColors = {
          "Conference": "bg-blue-100 text-blue-800",
          "Workshops": "bg-green-100 text-green-800",
          "Meetups": "bg-purple-100 text-purple-800",
          "Festivals": "bg-orange-100 text-orange-800",
          
        };
        
        return categoryColors[category] || "bg-gray-100 text-gray-800";
      };
      
      const getPriceColor = (price) => {
        if (price === 0 || price === "Free") return "text-green-600";
        return "text-blue-600";
      };
      
      const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };

  return (
    <Link
    to={`/event/${event.id}`}
      className="cursor-pointer" 
      
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
        <div className="h-48 relative overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-0 right-0 mt-3 mr-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getBadgeColor(event.category)}`}>
              {event.category}
            </span>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-2 hover:text-blue-600 transition-colors">{event.title}</h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
          
          <div className="flex items-center mb-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center mb-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.venue}</span>
          </div>
          
          <div className="flex items-center mb-2 text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>Capacity: {event.capacity}</span>
          </div>
          
          <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
            {/* <p className="text-gray-600 text-sm">{event.organizer}</p> */}
            <span className={`font-semibold ${getPriceColor(event.price)}`}>
              Rs {event.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
    
  );
};

export default EventCard;
