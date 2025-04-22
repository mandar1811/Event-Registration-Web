import { ChevronLeft, ChevronRight, Edit, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const EventTabDash = ({ activeTab }) => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: "Annual Tech Conference",
        date: "2025-05-15",
        location: "Convention Center",
        capacity: 500,
        registrations: 342,
        category: "Conference",
      },
      {
        id: 2,
        title: "Networking Mixer",
        date: "2025-04-30",
        location: "Downtown Hotel",
        capacity: 120,
        registrations: 98,
        category: "Meetups",
      },
      {
        id: 3,
        title: "Workshop: Leadership Skills",
        date: "2025-06-10",
        location: "Training Center",
        capacity: 50,
        registrations: 23,
        category: "Workshop",
      },
      {
        id: 4,
        title: "Product Launch Party",
        date: "2025-03-25",
        location: "Main Auditorium",
        capacity: 300,
        registrations: 300,
        category: "Workshop",
      },
    ];

    setEvents(mockEvents);
  }, []);

  return (
    <>
      <div>
              <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search events..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search
                      size={18}
                      className="absolute left-3 top-2.5 text-gray-400"
                    />
                  </div>
                  <select className="border p-2 rounded-lg">
                    <option value="all">All Statuses</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEvents.map((event) => (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {event.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(event.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {event.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
              ${event.category === "Tech" ? "bg-blue-100 text-blue-800" : ""}
              ${
                event.category === "Festival" ? "bg-pink-100 text-pink-800" : ""
              }
              ${
                event.category === "Conference"
                  ? "bg-purple-100 text-purple-800"
                  : ""
              }
              ${
                event.category === "Workshop"
                  ? "bg-yellow-100 text-yellow-800"
                  : ""
              }
              ${
                event.category === "Meetups"
                  ? "bg-green-100 text-green-800"
                  : ""
              }
              `}
                          >
                            {event.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {event.registrations} / {event.capacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Edit size={18} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredEvents.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No events found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">
                        {filteredEvents.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredEvents.length}
                      </span>{" "}
                      results
                    </p>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <ChevronLeft size={18} />
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <ChevronRight size={18} />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
    </>
  );
};

export default EventTabDash;
