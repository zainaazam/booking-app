const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/* The eventSchema is a new Schema object. 

The title, description, price, and date properties are required. 

The creator property is a reference to another document. 

The eventSchema is then used to create a new collection called events. 

The events collection will have the eventSchema as its schema. 

The events collection will be a child of the users collection. */
const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Event", eventSchema);
