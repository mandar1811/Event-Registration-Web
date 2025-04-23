import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronRight,
  Search,
} from "lucide-react";
import PopularCities from "./PopularCities";
import HeroImg from "../../src/assets/hero.png";
import { useNavigate } from "react-router-dom";

const Herosection = () => {
  const [email, setEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 overflow-hidden">
        <div className="w-[90%] mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row justify-between  items-center">
          {/* Left Content */}
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              DISCOVER YOUR <br />
              CITY'S BEST EVENTS
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Find and register for amazing events happening in your area.
              Connect with like-minded people and create unforgettable memories.
            </p>

            {/* Search Form */}
            <div className="bg-white p-2 rounded-lg shadow-lg flex flex-col sm:flex-row">
              <div className="flex-grow flex items-center px-3 mb-2 sm:mb-0">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search for events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors"
              >
                Find Events
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className=" relative mr-[5%]">
            <div className="relative z-10 rounded-lg overflow-hidden ">
              <img
                src={HeroImg}
                alt="People enjoying an event"
                className="w-[300px] h-auto object-contain"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-purple-500 rounded-lg w-64 h-64 opacity-20"></div>
            <div className="absolute top-10 left-0 bg-indigo-500 rounded-full w-32 h-32 opacity-20"></div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 bg-purple-400 rounded-full w-64 h-64 opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 bg-indigo-400 rounded-full w-80 h-80 opacity-10 transform -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <PopularCities />
    </div>
  );
};

export default Herosection;
