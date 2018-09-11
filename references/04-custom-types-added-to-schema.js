// Now we have added some fields to our schema that we want to make available
// Id - id field derived from last part of url field value
// allegiances / swornMembers - fields that contain arrays linking the two object types

// Each character object has the field "allegiances" which contains a list
// of objects of type "House" that the character belongs to and vice versa
// for house objects

// If you try to fetch either allegiances or swornMembers fields at this point,
// the resonse will be providing an array of strings, but our schema specifies
// an array of our custom object types

// In the next stage, we will implement resolvers that fetch the custom objects
// from the url strings in the plain response

import 'babel-polyfill';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import axios from 'axios';
import * as config from './config';

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    characters: [Character],
    character(id: ID!): Character,
    houses: [House],
    house(id: ID!): House
  },
  type Character {
    id: ID!,
    url: String!,
    name: String,
    aliases: [String],
    gender: String
    allegiances: [House]
  },
  type House {
    id: ID!,
    url: String!,
    name: String,
    region: String,
    swornMembers: [Character]
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  characters: async () => {
    const response = await axios(`/characters`, config.axios)
    return response.data;
  },
  character: async (args) => {
    const response = await axios(`/characters/${args.id}`, config.axios)
    return response.data;
  },
  houses: async () => {
    const response = await axios(`/houses`, config.axios)
    return response.data;
  },
  house: async (args) => {
    const response = await axios(`/houses/${args.id}`, config.axios)
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
