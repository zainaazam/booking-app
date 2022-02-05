import React from "react";
import "./BookingList.css";

/**
 * Create a list of bookings, each of which is a list item. 
 * 
 * Each list item has a booking's title and date. 
 * 
 * Each list item has a button that will delete the booking when clicked.
 * @param props - the props object that is passed to the component
 * @returns A list of booking items.
 */
const BookingList = (props) => {
  return (
    <ul className="bookings__list">
      {props.bookings.map((booking) => {
        return (
          <li key={booking._id} className="bookings__item">
            <div className="booking__item-data">
              {booking.event.title} -{" "}
              {new Date(booking.createdAt).toLocaleDateString()}
            </div>
            <div className="bookings__item-actions">
              <button
                className="btn"
                onClick={props.onDelete.bind(this, booking._id)}
              >
                Cancel
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default BookingList;
