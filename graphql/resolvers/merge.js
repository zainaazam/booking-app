const DataLoader = require("dataloader");

const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

/* Creating a DataLoader that will load the events for a given list of event ids. */
const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

/* Creating a new DataLoader that will load the User model for each userId in the userIds array. */
const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

/**
 * It returns an array of events that match the eventIds provided.
 * @param eventIds - An array of event IDs.
 * @returns An array of events.
 */
const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

/**
 * It loads a single event by ID.
 * @param eventId - The ID of the event you want to retrieve.
 * @returns The event object.
 */
const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
};

/**
 * It returns a user with the id of the userId parameter.
 * @param userId - The id of the user we want to load.
 * @returns The user object is being returned.
 */
const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

/**
 * It transforms the event document into an event object.
 * @param event - The event that was created.
 * @returns The event object is being returned with the creator object added to it.
 */
const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
  };
};

/**
 * It transforms a booking document into a booking object.
 * @param booking - the document that was just created
 * @returns The booking object with the user and event objects attached.
 */
const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.eventLoader = eventLoader;
