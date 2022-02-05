import React from "react";
import "./EventList.css";
import EventItem from "./EventItem/EventItem";

/**
 * It maps over the events array and returns an EventItem component for each event.
 * @param props - The props object is a JavaScript object that contains all the properties of the
 * component.
 * @returns An unordered list of EventItem components.
 */
const EventList = (props) => {
  const events = props.events.map((event) => {
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        title={event.title}
        price={event.price}
        date={event.date}
        userId={props.authUserId}
        creatorId={event.creator._id}
        creatorName={event.creator.name}
        onDetail={props.onViewDetail}
      />
    );
  });
  return <ul className="event__list">{events}</ul>;
};

export default EventList;
