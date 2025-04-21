import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ChevronRight } from 'lucide-react';

const EventCategory = () => {
  const navigate = useNavigate();

  const categories = [
    { icon: <Users className="h-8 w-8" />, name: "Conferences", color: "bg-blue-100 text-blue-600" },
    { icon: <Clock className="h-8 w-8" />, name: "Workshops", color: "bg-green-100 text-green-600" },
    { icon: <MapPin className="h-8 w-8" />, name: "Meetups", color: "bg-yellow-100 text-yellow-600" },
    { icon: <Calendar className="h-8 w-8" />, name: "Festivals", color: "bg-pink-100 text-pink-600" }
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/search?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="w-[90%] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Browse Event Categories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover events that match your interests and passions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className="bg-white rounded-lg shadow-md transition-transform hover:transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="p-6 text-center">
                <div className={`mx-auto rounded-full p-3 inline-flex mb-4 ${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">Explore upcoming {category.name.toLowerCase()}</p>
                <span className="text-purple-600 inline-flex items-center font-medium">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCategory;
