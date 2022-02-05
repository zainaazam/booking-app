const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const isAuth = require("./middleware/is-auth");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

/* Creating an express app and setting it to the variable app. */
const app = express();

/* This is telling Express to use the bodyParser middleware for all requests with a content-type of
"application/json". */
app.use(bodyParser.json());

/* The code bellow is a middleware function that will run on every request. 

The code will set the Access-Control-Allow-Origin header to *, which will allow any website to make
requests to this web app. 

The code will set the Access-Control-Allow-Methods header to POST, GET, and OPTIONS. 

The code will set the Access-Control-Allow-Headers header to Content-Type and Authorization. 

If the request method is OPTIONS, the code will return an HTTP status code of 200 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

/* This is a middleware that will run before any other route. It will check if the user is
authenticated and if not, it will redirect them to the login page. */
app.use(isAuth);

/* Use the `graphqlHTTP` function to create a new express route that accepts a GraphQL query. 

The `graphqlHTTP` function takes two parameters: 

* A schema that defines the data model for the GraphQL server. 
* A function that defines how to resolve fields in the schema when a client makes a request. 

The `graphqlHTTP` function returns an express route. 

The express route takes a GraphQL query as input and returns a GraphQL response as output.  */
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    graphiql: true,
    rootValue: graphQlResolvers,
  })
);

/* Connect to the MongoDB Atlas cluster, and then start the server. */
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
