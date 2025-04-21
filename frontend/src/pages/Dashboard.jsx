import { useState, useEffect } from 'react';
import {
  Calendar, Users, CirclePlus, Edit, Trash2,
  ChevronLeft, ChevronRight, Layers, CheckCircle,
  BarChart2, Clock, Search, Filter, User, UserPlus
} from 'lucide-react';

export default function Dashboard() {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    activeEvents: 0
  });

  // Mock data initialization
  useEffect(() => {
    // In a real app, this would be API calls
    const mockEvents = [
      {
        id: 1,
        title: "Annual Tech Conference",
        date: "2025-05-15",
        location: "Convention Center",
        capacity: 500,
        registrations: 342,
        status: "active"
      },
      {
        id: 2,
        title: "Networking Mixer",
        date: "2025-04-30",
        location: "Downtown Hotel",
        capacity: 120,
        registrations: 98,
        status: "active"
      },
      {
        id: 3,
        title: "Workshop: Leadership Skills",
        date: "2025-06-10",
        location: "Training Center",
        capacity: 50,
        registrations: 23,
        status: "upcoming"
      },
      {
        id: 4,
        title: "Product Launch Party",
        date: "2025-03-25",
        location: "Main Auditorium",
        capacity: 300,
        registrations: 300,
        status: "completed"
      }
    ];
   
    setEvents(mockEvents);
   
    // Calculate stats
    setStats({
      totalEvents: mockEvents.length,
      totalUsers: 1250,
      totalRegistrations: mockEvents.reduce((sum, event) => sum + event.registrations, 0),
      activeEvents: mockEvents.filter(event => event.status === "active").length
    });
  }, []);

  // Event handlers
  const handleAddEvent = () => {
    setCurrentEvent({
      id: null,
      title: "",
      date: "",
      location: "",
      capacity: 0,
      registrations: 0,
      status: "upcoming"
    });
    setIsModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  // const handleDeleteEvent = (eventId) => {
  //   if (confirm("Are you sure you want to delete this event?")) {
  //     setEvents(events.filter(event => event.id !== eventId));
  //     // Update stats
  //     setStats(prev => ({
  //       ...prev,
  //       totalEvents: prev.totalEvents - 1,
  //       activeEvents: events.find(e => e.id === eventId).status === "active"
  //         ? prev.activeEvents - 1
  //         : prev.activeEvents
  //     }));
  //   }
  // };

  const handleSaveEvent = (eventData) => {
    if (eventData.id) {
      // Update existing event
      setEvents(events.map(event =>
        event.id === eventData.id ? eventData : event
      ));
    } else {
      // Add new event
      const newEvent = {
        ...eventData,
        id: events.length ? Math.max(...events.map(e => e.id)) + 1 : 1,
        registrations: 0
      };
      setEvents([...events, newEvent]);
     
      // Update stats
      setStats(prev => ({
        ...prev,
        totalEvents: prev.totalEvents + 1,
        activeEvents: newEvent.status === "active" ? prev.activeEvents + 1 : prev.activeEvents
      }));
    }
    setIsModalOpen(false);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Component for the modal form
  const EventFormModal = ({ event, onSave, onClose }) => {
    const [formData, setFormData] = useState(event || {
      title: "",
      date: "",
      location: "",
      capacity: 0,
      status: "upcoming"
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };
    

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">
            {event?.id ? "Edit Event" : "Add New Event"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                className="w-full p-2 border rounded"
                min="0"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Event
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4">
          <h1 className="text-xl font-bold">Event Admin</h1>
        </div>
        <nav className="flex-1">
          <ul>
            <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center w-full px-4 py-3 ${activeTab === 'dashboard' ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
              >
                <BarChart2 size={18} className="mr-3" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center w-full px-4 py-3 ${activeTab === 'events' ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
              >
                <Calendar size={18} className="mr-3" />
                Events
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('registrations')}
                className={`flex items-center w-full px-4 py-3 ${activeTab === 'registrations' ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
              >
                <UserPlus size={18} className="mr-3" />
                Registrations
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center w-full px-4 py-3 ${activeTab === 'users' ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
              >
                <Users size={18} className="mr-3" />
                Users
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <User size={18} className="mr-2" />
            <span>Admin User</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'events' && 'Event Management'}
              {activeTab === 'registrations' && 'Registration Management'}
              {activeTab === 'users' && 'User Management'}
            </h2>
            {activeTab === 'events' && (
              <button
                onClick={handleAddEvent}
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
              >
                <CirclePlus size={18} className="mr-2" />
                Add Event
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Calendar size={24} className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-sm">Total Events</h3>
                      <p className="text-2xl font-bold">{stats.totalEvents}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-green-500">{stats.activeEvents} active</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Users size={24} className="text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-sm">Total Users</h3>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-gray-500">Growing steadily</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <CheckCircle size={24} className="text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-sm">Registrations</h3>
                      <p className="text-2xl font-bold">{stats.totalRegistrations}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-green-500">+12% from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Layers size={24} className="text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-sm">Average Attendance</h3>
                      <p className="text-2xl font-bold">76%</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-gray-500">Based on past events</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold text-lg mb-4">Upcoming Events</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {events
                          .filter(event => event.status === 'upcoming')
                          .slice(0, 5)
                          .map(event => (
                            <tr key={event.id}>
                              <td className="px-4 py-3 whitespace-nowrap">{event.title}</td>
                              <td className="px-4 py-3 whitespace-nowrap">{new Date(event.date).toLocaleDateString()}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-right">{event.registrations} / {event.capacity}</td>
                            </tr>
                          ))}
                        {events.filter(event => event.status === 'upcoming').length === 0 && (
                          <tr>
                            <td colSpan="3" className="px-4 py-3 text-center text-gray-500">No upcoming events</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold text-lg mb-4">Active Events</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Fill Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {events
                          .filter(event => event.status === 'active')
                          .slice(0, 5)
                          .map(event => (
                            <tr key={event.id}>
                              <td className="px-4 py-3 whitespace-nowrap">{event.title}</td>
                              <td className="px-4 py-3 whitespace-nowrap">{event.location}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-right">
                                {Math.round((event.registrations / event.capacity) * 100)}%
                              </td>
                            </tr>
                          ))}
                        {events.filter(event => event.status === 'active').length === 0 && (
                          <tr>
                            <td colSpan="3" className="px-4 py-3 text-center text-gray-500">No active events</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Events Management View */}
          {activeTab === 'events' && (
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
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEvents.map(event => (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{event.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(event.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{event.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${event.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                            ${event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : ''}
                            ${event.status === 'completed' ? 'bg-gray-100 text-gray-800' : ''}
                            ${event.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {event.registrations} / {event.capacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            // onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredEvents.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No events found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEvents.length}</span> of{' '}
                        <span className="font-medium">{filteredEvents.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
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
            </div>
          )}

          {/* Registrations View */}
          {activeTab === 'registrations' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Registration Management</h3>
              <p className="text-gray-600 mb-4">View and manage attendee registrations across all events.</p>
             
              {/* For demo purposes, just showing a placeholder */}
              <div className="bg-gray-50 p-8 text-center rounded-lg border-2 border-dashed border-gray-300">
                <Clock size={40} className="mx-auto text-gray-400 mb-3" />
                <h4 className="text-lg font-medium text-gray-700">Registration Details</h4>
                <p className="text-gray-500 mt-2">This section would contain registration details, filters, and management tools</p>
              </div>
            </div>
          )}

          {/* Users View */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">User Management</h3>
              <p className="text-gray-600 mb-4">Manage event attendees and system users.</p>
             
              {/* For demo purposes, just showing a placeholder */}
              <div className="bg-gray-50 p-8 text-center rounded-lg border-2 border-dashed border-gray-300">
                <Users size={40} className="mx-auto text-gray-400 mb-3" />
                <h4 className="text-lg font-medium text-gray-700">User Directory</h4>
                <p className="text-gray-500 mt-2">This section would contain user information, roles, and management tools</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <EventFormModal
          event={currentEvent}
          onSave={handleSaveEvent}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
