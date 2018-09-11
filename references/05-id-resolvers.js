// Now we've added resolvers for each custom object type, Character and House
// At the moment we are only resolving the "id" field - which is being derived
// from the last part of the URL field

// Note: we needed to import graphql-tools to do this
// I couldn't figure out how to replicate this functionality using
// vanilla GraphQL.js

import 'babel-polyfill';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import axios from 'axios';
import * as config from './config';
import { makeExecutableSchema } from 'graphql-tools';

// Construct a schema, using GraphQL schema language
const typeDefs = `
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
`;

// The root provides a resolver function for each API endpoint
const resolvers = {
  Query: {
    characters: async () => {
      const response = await axios(`/characters`, config.axios)
      return response.data;
    },
    character: async (obj, args) => {
      const response = await axios(`/characters/${args.id}`, config.axios)
      return response.data;
    },
    houses: async () => {
      const response = await axios(`/houses`, config.axios)
      return response.data;
    },
    house: async (obj, args) => {
      const response = await axios(`/houses/${args.id}`, config.axios)
      return response.data;
    }
  },
  Character: {
    id: character => character.url.split("/").pop()
  },
  House: {
    id: house => house.url.split("/").pop()
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
