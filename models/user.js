const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/* The userSchema is a new Schema object that defines the structure of the user collection. The
userSchema has a field called email that is a string, required, and cannot be blank. And
also a field called name that is a string, required, and cannot be blank.And also
a field called service that is a string, and can be blank.And also a field
called password that is a string, required, and cannot be blank.And also a field
called createdEvents that is an array of events that have been created by the user*/
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
