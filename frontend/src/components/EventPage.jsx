import React, { useEffect, useState } from "react";
import EventGrid from "./EventGrid";
import Pagination from "./Pagination";
import axios from "axios";

const EventPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [event, setEvent] = useState([]);

  // Calculate pagination
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = event.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(event.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const getData = async () => {
    const res = await axios.get("http://localhost:5000/events");
    // console.log(res.data)
    setEvent(res.data);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="w-[90%]  mx-auto">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>

          <EventGrid events={currentEvents} />
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default EventPage;
