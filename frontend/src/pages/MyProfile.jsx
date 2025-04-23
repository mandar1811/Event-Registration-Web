import React, { useEffect, useState } from "react";
import axios from "axios";
import EventGrid from "../components/EventGrid";

const MyProfile = () => {
  const [event, setEvent] = useState([]);
  const username=localStorage.getItem("username")

  useEffect(() => {
    const getData=async()=>{
       const token= localStorage.getItem("access_token")
        const res= await axios.get("http://localhost:5000/my-registrations", {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          setEvent(res.data)

    }
    getData()
  }, []);

  return (
    <>
      <div className="w-[90%]  mx-auto">
        <h1 className="text-2xl font-bold mb-4 pl-8 py-4 mt-4">Hello, {username} 👋</h1>
        <h2 className="text-xl font-semibold mb-2 pl-8">
          Your Event Registrations:
        </h2>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EventGrid events={event} />
        </main>
      </div>
    </>
  );
};

export default MyProfile;
