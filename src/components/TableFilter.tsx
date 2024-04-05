import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_FILTER_DATA } from "../graphql/queries";
import FilterTags from "./FilterTags";

interface Person {
  gender: string | null;
  eyeColor: string | null;
  species: { name: string } | null;
  filmConnection: { films: { title: string }[] } | null;
}

interface QueryResult {
  allPeople: {
    people: Person[];
  };
}

const TableFilter = () => {
  const { data, loading, error } = useQuery<QueryResult>(GET_FILTER_DATA);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleChange = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  if (!data || !data.allPeople || !data.allPeople.people)
    return <p>No data found</p>;

  const genders = new Set(
    data.allPeople.people
      .map((person) => person.gender)
      .filter(Boolean) as string[]
  );

  const eyeColors = new Set(
    data.allPeople.people
      .map((person) => person.eyeColor)
      .filter(Boolean) as string[]
  );

  const speciesNames = new Set(
    data.allPeople.people
      .flatMap((person) => (person.species ? person.species.name : []))
      .filter(Boolean)
  );

  const filmsTitles = new Set(
    data.allPeople.people
      .flatMap((person) =>
        person.filmConnection
          ? person.filmConnection.films.map((film) => film.title)
          : []
      )
      .filter(Boolean)
  );

  return (
    <div className="bg-white rounded-lg my-4 p-2">
      <FilterTags
        title="Gender"
        tags={genders}
        selectedTags={selectedTags}
        onChange={handleChange}
      />
      <FilterTags
        title="Eye Colors"
        tags={eyeColors}
        selectedTags={selectedTags}
        onChange={handleChange}
      />
      <FilterTags
        title="Species"
        tags={speciesNames}
        selectedTags={selectedTags}
        onChange={handleChange}
      />
      <FilterTags
        title="Films"
        tags={filmsTitles}
        selectedTags={selectedTags}
        onChange={handleChange}
      />
    </div>
  );
};

export default TableFilter;
