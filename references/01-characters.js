// At this point, we have queries for:
// * list all characters

import 'babel-polyfill';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import axios from 'axios';
import * as config from './config';

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    characters: [Character]
  },
  type Character {
    url: String!,
    name: String,
    aliases: [String],
    gender: String
  },
  type House {
    url: String!,
    name: String,
    region: String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  characters: async () => {
    const response = await axios(`/characters`, config.axios)
    return response.data;
  }
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
