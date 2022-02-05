const Event = require("../../models/event");
const User = require("../../models/user");

const { transformEvent } = require("./merge");

module.exports = {
  /* The events() method is a function that returns a promise. The promise is fulfilled with an array
  of events.
  
  The transformEvent() function is a function that takes an event as an argument and returns a new
  object with the following properties:
  
  id: the event's id
  title: the event's title
  description: the event's description
  date: the event's date
  
  The transformEvent() function is used to transform the event data into a format that can be
  returned to the client. */
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  /* Create an event by providing a title, description, price, date, and creator. 
  
  The date is provided as a string, so we'll need to parse it into a Date object. 
  
  The creator is provided as a user ID, so we'll need to find the user in the database. 
  
  If the user is found, we'll add the event to the user's createdEvents array. 
  
  We'll then save the event to the database and return the created event. 
  
  If an error occurs, we'll throw an error */
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error("User not found.");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
