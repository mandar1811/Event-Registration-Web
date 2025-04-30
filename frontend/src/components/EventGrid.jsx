import React from 'react';
import EventCard from './EventCard';

const EventGrid = ({ events, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id || event.event_id}
          event={event}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default EventGrid;
