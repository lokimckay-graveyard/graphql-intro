# graphql-example

## What is grahpql?

An open-source query language for APIs by Facebook

REST has a set of endpoints that each return fixed data structures
GraphQL has a single endpoint that returns flexible data structures

"With GraphQL, the client dictates the shape of the response by sending a query that’s resolved by the server."
https://www.prisma.io/blog/how-to-wrap-a-rest-api-with-graphql-8bf3fb17547d/

## Why does it exist / Why use it

Ref: https://www.prisma.io/blog/how-to-wrap-a-rest-api-with-graphql-8bf3fb17547d/

Advantages over rest:
Rest is schemaless - you don't know what your response will look like if you have never hit the api before
Graphql apis have a schema that is built into the API itself

Nested N+1 problem
Given this API:

/customers
/customers/<id>
/customers/<id>/posts
/accounts
/accounts/<id>
/customers/<id>/accounts

When you have a REST api endpoint that lists a resource, and the resources in the list have collections of resources. E.g:

/users

[
  {
    "id": "user-0",
    "name": "Nikolas",
    "postIds": []
  },
  {
    "id": "user-1",
    "name": "Sarah",
    "postIds": ["post-0", "post-1"]
  },
  {
    "id": "user-2",
    "name": "Johnny",
    "postIds": ["post-2"]
  },
  {
    "id": "user-3",
    "name": "Jenny",
    "postIds": ["post-3", "post-4"]
  }
]

But say now a consuming app wants a list of users and the title of their latest post
You would need to iterate over the results of /users and make additional calls for each post ID for a given user to get the titles of each post

To circumvent this problem, you can go with a nested API design. With that approach, instead of an array of IDs, each user object would directly carry an array of entire post objects

Problem with this approach is that the call produces a massive response and you're going to be wasting bandwidth getting unneeded data

Can start to get ridiculously large responses for multi-levelled nesting

Result: Approach that we use today is to build REST API's on the fly while we are building our frontends - as we get new requirements, we just add functionality to the API
(Or we build BFFs / middlemen services)

Solution: Use Graphql to build a flexible API that can deliver whatever the client requests and nothing more

Note: If you wrap a rest api in graphql - this means that you will just be moving the problems away from the client - which is ok

## Building a simple example

Start here: https://graphql.org/graphql-js/
Running as a server: http://graphql.github.io/graphql-js/running-an-express-graphql-server/

What is this stuff?
  Schema = Defines what queries / mutations are provided by this graphql server
    What is a query / what is a mutation?
      Query is read
      Mutation is write
  "Root" resolver = provides a response for the request's query or object fields
  Express = Makes the graphql server available at a given endpoint

Different ways to call the server: http://graphql.github.io/graphql-js/graphql-clients/
  * Simple HTTP call (cURL / Postman)
  * UI tool (GraphiQL / GraphQL Playground / Insomnia)
      benefits: has support for schema autocompletion etc.
  * GraphQL client used in a js app (Relay or Apollo Client)
      benefits: batching, caching & more

GOT api
https://anapioficeandfire.com/

## And beyond

Dynamic auth
