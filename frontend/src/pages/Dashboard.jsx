import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  CirclePlus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  BarChart2,
  Clock,
  Search,
  User,
  UserPlus,
} from "lucide-react";
import EventsCategoryChart from "../components/EventsCategoryChart";
import EventsByMonthChart from "../components/EventsByMonthChart";
import EventTabDash from "../components/EventTabDash";
import RegistrationTabDash from "../components/RegistrationTabDash";
import UserTabDash from "../components/UserTabDash";

export default function Dashboard() {
  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    activeEvents: 0,
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

    // Calculate stats
    setStats({
      totalEvents: mockEvents.length,
      totalUsers: 1250,
      totalRegistrations: mockEvents.reduce(
        (sum, event) => sum + event.registrations,
        0
      ),
      activeEvents: mockEvents.filter((event) => event.status === "active")
        .length,
    });
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4">
          <h1 className="text-xl font-bold">EventHub </h1>
        </div>
        <nav className="flex-1">
          <ul>
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center w-full px-4 py-3 ${
                  activeTab === "dashboard"
                    ? "bg-blue-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <BarChart2 size={18} className="mr-3" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("events")}
                className={`flex items-center w-full px-4 py-3 ${
                  activeTab === "events" ? "bg-blue-700" : "hover:bg-gray-700"
                }`}
              >
                <Calendar size={18} className="mr-3" />
                Events
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("registrations")}
                className={`flex items-center w-full px-4 py-3 ${
                  activeTab === "registrations"
                    ? "bg-blue-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <UserPlus size={18} className="mr-3" />
                Registrations
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center w-full px-4 py-3 ${
                  activeTab === "users" ? "bg-blue-700" : "hover:bg-gray-700"
                }`}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "events" && "Event Management"}
              {activeTab === "registrations" && "Registration Management"}
              {activeTab === "users" && "User Management"}
            </h2>
            {
             activeTab === "dashboard" && "Dashboard" ?  <button
             onClick={() => {
               localStorage.clear();
               window.location.href = "/login";
             }}
             className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition"
           >
             Logout
           </button> : null
            }
           
            {activeTab === "events" && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
                <CirclePlus size={18} className="mr-2" />
                Add Event
              </button>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard View */}
          {activeTab === "dashboard" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <CheckCircle size={24} className="text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-sm">Registrations</h3>
                      <p className="text-2xl font-bold">
                        {stats.totalRegistrations}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EventsCategoryChart />
                <EventsByMonthChart />
              </div>
            </div>
          )}
          {/* Events Management View */}
          {activeTab === "events" && <EventTabDash />}
          {/* Registrations View */}
          {activeTab === "registrations" && <RegistrationTabDash />}
          {/* Users View */}
          {activeTab === "users" && <UserTabDash />}
        </main>
      </div>
    </div>
  );
}
