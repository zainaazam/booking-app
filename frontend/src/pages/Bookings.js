import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/auth-context";
import BookingList from "../components/Bookings/BookingList/BookingList";

/**
 * It fetches the bookings from the server, and then renders them
 * @returns The BookingsPage component is returning a div element.
 */
const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  const context = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
  });

  /**
   * It fetches the bookings from the server, then it updates the bookings state
   */
  const fetchBookings = () => {
    const requestBody = {
      query: `
          query {
            bookings {
              _id
             createdAt
             event {
               _id
               title
               date
             }
            }
          }
        `,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const bookings = resData.data.bookings;
        setBookings(bookings);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * It takes in a bookingId and sends a mutation request to the server to delete the booking with that
   * ID
   * @param bookingId - The ID of the booking to be deleted.
   */
  const deleteBookingHandler = (bookingId) => {
    const requestBody = {
      query: `
          mutation {
            cancelBooking(bookingId: "${bookingId}") {
              _id
              title
            }
          }
        `,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const updatedBookings = bookings.filter((booking) => {
          return booking._id !== bookingId;
        });
        setBookings(updatedBookings);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /* The `BookingList` component is responsible for displaying the list of bookings. 
  It receives the bookings from the parent component via the `bookings` prop. 
  It also receives a callback function, `onDelete`, that is responsible for deleting a booking.  */
  return (
    <div>
      <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
    </div>
  );
};

export default BookingsPage;
