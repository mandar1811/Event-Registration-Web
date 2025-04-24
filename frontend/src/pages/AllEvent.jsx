import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import EventGrid from "../components/EventGrid";
import { Search, Filter, Calendar, ChevronDown, Loader, ChevronLeft, ChevronRight } from "lucide-react"; 

const AllEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  
  // Reference for carousel auto-scroll timer
  const carouselTimerRef = useRef(null);
  
  // Sort options configuration
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "priceAsc", label: "Price: Low to High" },
    { value: "priceDesc", label: "Price: High to Low" }
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/events");
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch events. Please try again later.");
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsFilterDropdownOpen(false);
      setIsSortDropdownOpen(false);
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Setup carousel auto-scroll
  useEffect(() => {
    if (events.length > 0) {
      carouselTimerRef.current = setInterval(() => {
        setCurrentCarouselIndex(prevIndex => 
          prevIndex === Math.min(events.length - 1, 4) ? 0 : prevIndex + 1
        );
      }, 5000);
      
      return () => {
        if (carouselTimerRef.current) {
          clearInterval(carouselTimerRef.current);
        }
      };
    }
  }, [events.length]);

  // Get unique categories from events
  const categories = ["All", ...new Set(events.map(event => event.category).filter(Boolean))];

  // Filter events based on category and search term
  const getFilteredAndSortedEvents = () => {
    // First apply filters
    let filteredResults = events.filter(event => {
      const matchesCategory = categoryFilter === "All" || event.category === categoryFilter;
      const matchesSearch = !searchTerm || 
                          event.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.venue?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    
    // Then sort the filtered results
    return filteredResults.sort((a, b) => {
      switch(sortOption) {
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  };

  const filteredAndSortedEvents = getFilteredAndSortedEvents();
  
  // For carousel, get the 5 most recent events
  const carouselEvents = events
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .filter(event => new Date(event.date) >= new Date())
    .slice(0, 5);
  
  // Navigation for carousel
  const nextCarouselSlide = () => {
    if (carouselTimerRef.current) {
      clearInterval(carouselTimerRef.current);
    }
    
    setCurrentCarouselIndex(prevIndex => 
      prevIndex === Math.min(carouselEvents.length - 1, 4) ? 0 : prevIndex + 1
    );
    
    carouselTimerRef.current = setInterval(() => {
      setCurrentCarouselIndex(prevIndex => 
        prevIndex === Math.min(carouselEvents.length - 1, 4) ? 0 : prevIndex + 1
      );
    }, 5000);
  };
  
  const prevCarouselSlide = () => {
    if (carouselTimerRef.current) {
      clearInterval(carouselTimerRef.current);
    }
    
    setCurrentCarouselIndex(prevIndex => 
      prevIndex === 0 ? Math.min(carouselEvents.length - 1, 4) : prevIndex - 1
    );
    
    carouselTimerRef.current = setInterval(() => {
      setCurrentCarouselIndex(prevIndex => 
        prevIndex === Math.min(carouselEvents.length - 1, 4) ? 0 : prevIndex + 1
      );
    }, 5000);
  };
  
  // Format date for display
  const formatEventDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Toggle dropdowns with stopPropagation to prevent closing from document click
  const toggleFilterDropdown = (e) => {
    e.stopPropagation();
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
    setIsSortDropdownOpen(false);
  };
  
  const toggleSortDropdown = (e) => {
    e.stopPropagation();
    setIsSortDropdownOpen(!isSortDropdownOpen);
    setIsFilterDropdownOpen(false);
  };
  
  const handleCategorySelect = (category) => {
    setCategoryFilter(category);
    setIsFilterDropdownOpen(false);
  };
  
  const handleSortSelect = (option) => {
    setSortOption(option);
    setIsSortDropdownOpen(false);
  };
  
  // Get current sort option label
  const getCurrentSortLabel = () => {
    return sortOptions.find(option => option.value === sortOption)?.label || "Sort by";
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b  from-blue-50 to-white">
      {/* Hero Section with Carousel */}
      <div className="relative h-96 mb-8 overflow-hidden">
        {/* Background and overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out"
          style={{ 
            backgroundImage: carouselEvents.length > 0 && carouselEvents[currentCarouselIndex]?.image 
              ? `url('${carouselEvents[currentCarouselIndex].image}')` 
              : "url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
            filter: "brightness(0.75)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60" />
        
        {/* Carousel Content */}
        <div className="relative h-full w-[90%] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            Discover Amazing Events
          </h1>
          
          <div className="mb-6">
            <div className="w-24 h-1 bg-blue-400 rounded-full"></div>
          </div>
          
          {carouselEvents.length > 0 ? (
            <div className="transition-all duration-500 ease-in-out">
              <p className="text-sm font-medium text-blue-300 mb-1">
                {carouselEvents[currentCarouselIndex]?.category}
              </p>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
                {carouselEvents[currentCarouselIndex]?.title}
              </h2>
              <div className="flex items-center mb-4">
                <div className="bg-blue-600/70 px-3 py-1 rounded-full text-white text-sm font-medium mr-3">
                  {formatEventDate(carouselEvents[currentCarouselIndex]?.date)}
                </div>
                <div className="bg-purple-600/70 px-3 py-1 rounded-full text-white text-sm font-medium">
                  {carouselEvents[currentCarouselIndex]?.venue}
                </div>
              </div>
              <p className="text-blue-100 max-w-xl line-clamp-2">
                {carouselEvents[currentCarouselIndex]?.description}
              </p>
              
              {/* Carousel Navigation */}
              <div className="mt-6 flex items-center">
                <button 
                  onClick={prevCarouselSlide}
                  className="mr-4 flex items-center justify-center h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  aria-label="Previous event"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={nextCarouselSlide}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  aria-label="Next event"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                
                {/* Carousel Indicators */}
                <div className="ml-6 flex items-center space-x-2">
                  {carouselEvents.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        currentCarouselIndex === index 
                          ? "w-6 bg-blue-400" 
                          : "w-2 bg-white/40 hover:bg-white/60"
                      }`}
                      onClick={() => {
                        if (carouselTimerRef.current) {
                          clearInterval(carouselTimerRef.current);
                        }
                        setCurrentCarouselIndex(index);
                        carouselTimerRef.current = setInterval(() => {
                          setCurrentCarouselIndex(prevIndex => 
                            prevIndex === Math.min(carouselEvents.length - 1, 4) ? 0 : prevIndex + 1
                          );
                        }, 5000);
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-lg text-blue-100 max-w-xl">
              Find and join the best events happening around you
            </p>
          )}
        </div>
      </div>
      
      <main className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category Filter Dropdown */}
            <div className="relative w-full md:w-64">
              <button
                onClick={toggleFilterDropdown}
                className="flex justify-between items-center w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">{categoryFilter || "All Categories"}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              
              {isFilterDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${
                        categoryFilter === category ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Event Count and Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {loading ? "Loading Events..." : `All Events (${filteredAndSortedEvents.length})`}
          </h2>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={toggleSortDropdown}
              className="flex items-center text-sm bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors"
            >
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              <span>{getCurrentSortLabel()}</span>
              <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
            </button>
            
            {isSortDropdownOpen && (
              <div className="absolute right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-48">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortSelect(option.value)}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${
                      sortOption === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredAndSortedEvents.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">No events found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter to find events.</p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && filteredAndSortedEvents.length > 0 && (
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-sm">
            <EventGrid events={filteredAndSortedEvents} />
          </div>
        )}
        
        {/* Pagination (optional) */}
        {!loading && !error && filteredAndSortedEvents.length > 12 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 rounded border border-blue-500 bg-blue-500 text-white hover:bg-blue-600">
                1
              </button>
              <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}
      </main>
      
      {/* Events Counter Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white font-medium">
            Showing {filteredAndSortedEvents.length} of {events.length} events
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllEvent;
