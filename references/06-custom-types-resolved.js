// Our resolvers now resolve the allegiances and swornMembers fields

// allegiances: we asynchronously fetch each URL listed and return the data as
// an array of House objects

// swornMembers: we asynchronously fetch each URL listed and return the data as
// an array of Character objects

// Whenever a query response contains a field that has a custom object type
// in our schema, (E.g. allegiances within type Character {} )
// the custom object type resolver will be called (e.g. Character )

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
    id: character => character.url.split("/").pop(),
    allegiances: async (character) => await asyncFetchList(character.allegiances)
  },
  House: {
    id: house => house.url.split("/").pop(),
    swornMembers: async (house) => await asyncFetchList(house.swornMembers)
  }
};

//Fetches many resources at once from an array of URLs
const asyncFetchList = async (urlArr) => {
  const promiseArr = urlArr.map(url => {
    return new Promise((resolve, reject) => {
      try {
        resolve(axios(url, config.axios));
      } catch(err) {
        reject(err);
      }
    })
  })
  const responseArr = await Promise.all(promiseArr);
  const dataArr = responseArr.map(response => response.data);
  return dataArr;
}

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
