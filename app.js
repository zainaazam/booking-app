const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const isAuth = require("./middleware/is-auth");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    graphiql: true,
    rootValue: graphQlResolvers,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.6ptu2.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(8000, () => console.log("Server Running"));
  })
  .catch((err) => {
    console.log(err);
  });
