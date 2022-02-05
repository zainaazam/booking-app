const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  /* This function returns all the bookings made by the user who made the request.
  
  The `req.isAuth` is a boolean that checks if the user is authenticated.
  
  The `req.userId` is the id of the user who made the request.
  
  The `transformBooking` function is a helper function that returns a JSON object with the booking
  data.
  
  The `Booking.find` function is a Mongoose function that returns all the bookings made by the user
  who made the request. */
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  /* The bookEvent function is a wrapper around the Booking model. It takes the eventId as an argument
  and uses the Booking model to create a new booking. The bookEvent function then returns the newly
  created booking. */
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  /* 1. Check if the user is authenticated. If not, throw an error.
  2. Find the booking with the given ID.
  3. Populate the event associated with the booking.
  4. Delete the booking.
  5. Return the event. */
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
