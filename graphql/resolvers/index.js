const authResolver = require("./auth");
const eventsResolver = require("./events");
const bookingResolver = require("./booking");

/* Creating a rootResolver object that contains all the resolvers. */
const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver,
};

module.exports = rootResolver;
