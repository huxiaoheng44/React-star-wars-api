import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_FILTER_DATA } from "../graphql/queries";
import FilterTags from "./FilterTags";
import { Button } from "antd";

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
  //const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [genderTags, setGenderTags] = useState<string[]>([]);
  const [eyeColorTags, setEyeColorTags] = useState<string[]>([]);
  const [speciesTags, setSpeciesTags] = useState<string[]>([]);
  const [filmsTags, setFilmsTags] = useState<string[]>([]);

  const handleChange = (
    tag: string,
    checked: boolean,
    tagsSet: string[],
    setTagsSet: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const nextSelectedTags = checked
      ? [...tagsSet, tag]
      : tagsSet.filter((t) => t !== tag);
    setTagsSet(nextSelectedTags);
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
    <div className="filter bg-white rounded-lg my-5 p-5 pb-2">
      <FilterTags
        title="Gender"
        tags={genders}
        selectedTags={genderTags}
        setTags={setGenderTags}
        onChange={handleChange}
      />
      <FilterTags
        title="Eye Colors"
        tags={eyeColors}
        selectedTags={eyeColorTags}
        setTags={setEyeColorTags}
        onChange={handleChange}
      />
      <FilterTags
        title="Species"
        tags={speciesNames}
        selectedTags={speciesTags}
        setTags={setSpeciesTags}
        onChange={handleChange}
      />
      <FilterTags
        title="Films"
        tags={filmsTitles}
        selectedTags={filmsTags}
        setTags={setFilmsTags}
        onChange={handleChange}
      />
      {/* enable search and reset search button */}

      <div className="flex justify-center space-x-10">
        <Button type="primary" className="my-2">
          Search
        </Button>
        <Button type="default" className="my-2">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default TableFilter;
