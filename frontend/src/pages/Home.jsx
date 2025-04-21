import React from "react";
import Herosection from "../components/Herosection";
import EventPage from "../components/EventPage";
import EventCategory from "../components/EventCategory";

const Home = () => {
  return (
    <>
      <Herosection />

      <EventCategory/>
      <EventPage />
    </>
  );
};

export default Home;
