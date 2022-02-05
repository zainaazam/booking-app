const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { eventLoader } = require("./merge");

const User = require("../../models/user");

module.exports = {
  /* This function returns all the users in the database. */
  users: async () => {
    try {
      const users = await User.find();
      return users.map((user) => {
        return {
          ...user._doc,
          _id: user.id,
          createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  /* Create a new user by providing an email, name, and password. */
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        name: args.userInput.name,
        service: args.userInput.service,
        password: hashedPassword,
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  /* The login function takes in an email and password, and returns a token if the user exists and the
  password is correct.
  */
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "somesupersecretkey",
      {
        expiresIn: "1h",
      }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
};
