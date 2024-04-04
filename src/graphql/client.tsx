import { ApolloClient, InMemoryCache } from "@apollo/client";

// create an ApolloClient instance
const client = new ApolloClient({
  uri: "https://swapi-graphql.netlify.app/.netlify/functions/index", // Star wars API
  cache: new InMemoryCache(),
});

export default client;
