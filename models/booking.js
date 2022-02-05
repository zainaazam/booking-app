const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/* The bookingSchema is a new Schema object that has two fields: event and user. The event field is an
ObjectId that points to the Event model. The user field is an ObjectId that points to the User
model.

The timestamps option is set to true, which adds two fields to the schema: createdAt and updatedAt.
These fields are automatically set when a new document is created or updated.

The new Schema object is assigned to the bookingSchema variable.*/
const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
