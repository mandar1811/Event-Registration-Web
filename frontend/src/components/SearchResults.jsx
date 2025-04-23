import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EventGrid from "./EventGrid";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const searchTerm = queryParams.get("q");
  const city = queryParams.get("city");
  const category = queryParams.get("category");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events");
        const data = await response.json();

        let filtered = data;

        if (searchTerm) {
          filtered = filtered.filter((event) =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (city) {
          filtered = filtered.filter((event) =>
            event.venue.toLowerCase().includes(city.toLowerCase())
          );
        }

        if (category) {
          filtered = filtered.filter((event) =>
            event.category?.toLowerCase() === category.toLowerCase()
          );
        }

        setEvents(filtered);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchTerm, city, category]);

  const title =
    searchTerm
      ? `Search Results for "${searchTerm}"`
      : city
      ? `Events in ${city}`
      : category
      ? `All ${category} Events`
      : "All Events";

  return (
    <div className="w-[90%] p-8 mx-auto">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600">No events found matching your criteria.</p>
        </div>
      ) : (
        
        <EventGrid events={events}/>
      )}
    </div>
  );
};

export default SearchResults;