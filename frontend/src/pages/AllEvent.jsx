import axios from "axios";
import React, { useEffect, useState } from "react";
import EventGrid from "../components/EventGrid";

const AllEvent = () => {
  const [event, setEvent] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5000/events");
      setEvent(res.data);
    };
  
    fetchData();
  }, []);

  
  
  return (
    <>
     <div className="w-[90%]  mx-auto">
       
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl text-center font-bold mb-6">All Events</h2>

          <EventGrid events={event} />
          
        </main>
      </div>
      
    </>
  );
};

export default AllEvent;
