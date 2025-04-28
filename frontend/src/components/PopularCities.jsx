import React from 'react';
import { useNavigate } from 'react-router-dom';

const PopularCities = () => {
  const navigate = useNavigate();

  const cities = [
    {
      id: 1,
      name: "Pune",
      image: "https://facts.net/wp-content/uploads/2023/06/40-facts-about-pune-1688109554.jpeg",
      events: 120
    },
    {
      id: 2,
      name: "Mumbai",
      image: "https://t3.ftcdn.net/jpg/03/55/64/04/360_F_355640480_FKKv2BQwqY6sMa6jmEGVPnEndX1GPtJU.jpg",
      events: 98
    },
    {
      id: 3,
      name: "Bangalore",
      image: "https://www.agoda.com/wp-content/uploads/2024/07/bangalore-feature-1244x700.jpg",
      events: 85
    },
    {
      id: 4,
      name: "Delhi",
      image: "https://s7ap1.scene7.com/is/image/incredibleindia/red-fort-delhi1-attr-hero?qlt=82&ts=1727352314555",
      events: 72
    },
    {
      id: 5,
      name: "Hyderabad",
      image: "https://www.goindigo.in/content/dam/s6web/in/en/assets/Destinations/destinations/hyderabad/073616_T_Prince_charminar-1.jpg",
      events: 63
    }
  ];

  const handleCityClick = (cityName) => {
    navigate(`/search?city=${encodeURIComponent(cityName)}`);
  };

  return (
    <div className="py-12 px-4 md:px-8 w-[90%] mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Popular cities on EventHub</h2>
      <p className="text-gray-600 mb-8 text-lg">
        Looking for fun things to do near you? See what event organizers are planning in cities around the country.
      </p>

      <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
        {cities.map((city) => (
          <div
            key={city.id}
            onClick={() => handleCityClick(city.name)}
            className="cursor-pointer flex flex-col items-center flex-shrink-0"
          >
            <div className="w-48 h-48 rounded-full overflow-hidden mb-3 shadow-md hover:shadow-lg transition-shadow duration-300">
              <img 
                src={city.image} 
                alt={`${city.name} events`} 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-medium text-gray-800">{city.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCities;
