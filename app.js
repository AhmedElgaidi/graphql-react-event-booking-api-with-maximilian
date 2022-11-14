const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql"); // this is a middleware that tunnel the requests to the graphql query parser that validte it according to our schema and then route the requests to the right resovlers!
const { buildSchema } = require("graphql");

const app = express();

app.use(bodyParser.json());

const events = [];

app.use(
  "/",
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        input EventInput{ 
            title: String!
            description: String!
            price: Float!
        }
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation{
            createEvent(eventInput: EventInput): Event
        }
        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const { title, description, price } = args.eventInput;
        const event = {
          _id: Math.floor(Math.random() * 1000000000000).toString(),
          title,
          description,
          price,
          date: new Date().toISOString(),
        };
        events.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);
app.listen(3000, () =>
  console.log("Server is runing on http://localhost:3000")
);

// Complete from video 5!