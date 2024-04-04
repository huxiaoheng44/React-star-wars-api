import React from "react";
import "./App.css";
import { useQuery } from "@apollo/client";
import { GET_ALL_PEOPLE } from "./graphql/queries";
import { ApolloProvider } from "@apollo/client";

function App() {
  const { loading, error, data } = useQuery(GET_ALL_PEOPLE);
  if (loading) return <p>Loading</p>;
  if (error) return <p>Error</p>;

  data.allPeople.people.map((person: any) => {
    console.log(person);
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Star Wars Characters</h1>
        {data &&
          data.allPeople.people.map((person: any) => (
            <div key={person.name}>
              <h2>{person.name}</h2>
              <p>Height: {person.height}</p>
              <p>Eye Color: {person.eyeColor}</p>
            </div>
          ))}
      </header>
    </div>
  );
}

export default App;
