const { buildSchema } = require("graphql");

/* The schema is a collection of types and their fields. 

The types are the blueprints for the data that will be stored in the database. 

The fields are the properties of the data.  */
module.exports = buildSchema(`
type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}
type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: User!
}
type User {
  _id: ID!
  email: String!
  name: String!
  service: String
  password: String
  createdEvents: [Event!]
}
type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}
input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
}
input UserInput {
  email: String!
  name: String!
  service: String
  password: String!
}
type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
    users: [User!]!
    login(email: String!, password: String!): AuthData!
}
type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);
