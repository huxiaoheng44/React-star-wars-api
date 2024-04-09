import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_FILTER_DATA } from "../graphql/queries";
import FilterTags from "./FilterTags";
import { Button, notification, Switch } from "antd";
import { FilterFilled, FilterOutlined } from "@ant-design/icons";

interface Person {
  id: string;
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

interface FilterTagsProps {
  FavoriteMode?: boolean;
  filteredIDs: string[];
  isFilterEnabled: boolean;
  setFilteredIDs: React.Dispatch<React.SetStateAction<string[]>>;
  setIsFilterEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const TableFilter: React.FC<FilterTagsProps> = ({
  FavoriteMode,
  filteredIDs,
  isFilterEnabled,
  setFilteredIDs,
  setIsFilterEnabled,
}) => {
  const { data, loading, error } = useQuery<QueryResult>(GET_FILTER_DATA);
  //const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [genderTags, setGenderTags] = useState<string[]>([]);
  const [eyeColorTags, setEyeColorTags] = useState<string[]>([]);
  const [speciesTags, setSpeciesTags] = useState<string[]>([]);
  const [filmsTags, setFilmsTags] = useState<string[]>([]);
  // relation between different tags
  const [isOrRelation, setIsOrRelation] = useState(false);
  // notification
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message: string, description: string) => {
    api.info({
      message: message,
      description: description,
      placement: "top",
    });
  };

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

  const handleFilter = () => {
    // console.log(genderTags, eyeColorTags, speciesTags, filmsTags);
    // clear previous filtered IDs
    setFilteredIDs([]);
    const filteredPeopleIds: string[] = [];
    // filter person id based on selected tags
    if (isOrRelation) {
      for (const person of data.allPeople.people) {
        if (eyeColorTags.includes(person.eyeColor as string)) {
          filteredPeopleIds.push(person.id);
        }
        if (genderTags.includes(person.gender as string)) {
          filteredPeopleIds.push(person.id);
        }
        if (speciesTags.includes(person.species?.name as string)) {
          filteredPeopleIds.push(person.id);
        }
        if (
          filmsTags.some((film) =>
            person.filmConnection?.films.some((f) => f.title === film)
          )
        ) {
          filteredPeopleIds.push(person.id);
        }
      }
    } else {
      // if (
      //   eyeColorTags.length === 0 ||
      //   genderTags.length === 0 ||
      //   speciesTags.length === 0 ||
      //   filmsTags.length === 0
      // ) {
      //   openNotification(
      //     "Notification",
      //     "Please select at least one tag from each category"
      //   );
      //   return;
      // }
      for (const person of data.allPeople.people) {
        const matchesEyeColor =
          eyeColorTags.length === 0 ||
          eyeColorTags.includes(person.eyeColor as string);
        const matchesGender =
          genderTags.length === 0 ||
          genderTags.includes(person.gender as string);
        const matchesSpecies =
          speciesTags.length === 0 ||
          speciesTags.includes(person.species?.name as string);
        const matchesFilms =
          filmsTags.length === 0 ||
          filmsTags.every((film) =>
            person.filmConnection?.films.some((f) => f.title === film)
          );

        if (
          matchesEyeColor &&
          matchesGender &&
          matchesSpecies &&
          matchesFilms
        ) {
          filteredPeopleIds.push(person.id);
        }
      }
    }
    setFilteredIDs(filteredPeopleIds);
    setIsFilterEnabled(true);
  };

  const handleFilterReset = () => {
    setGenderTags([]);
    setEyeColorTags([]);
    setSpeciesTags([]);
    setFilmsTags([]);
    setFilteredIDs([]);
    setIsFilterEnabled(false);
  };

  return (
    <div className="filter bg-white rounded-lg my-5 p-5 pb-2">
      {contextHolder}
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
        <div className="flex justify-center space-x-10 flex-grow pl-60">
          <Button
            type="primary"
            className="my-2"
            onClick={handleFilter}
            icon={isFilterEnabled ? <FilterFilled /> : <FilterOutlined />}
          >
            Apply Filter
          </Button>

          <Button
            type="primary"
            className="my-2"
            onClick={handleFilterReset}
            style={{ backgroundColor: "DimGray " }}
          >
            Reset
          </Button>
        </div>
        <div className=" flex justify-end items-center">
          <div className="font-semibold px-2">Filter Logic: </div>
          {/* <Button
            type="primary"
            className="my-2"
            onClick={() => {
              setIsOrRelation(!isOrRelation);
            }}
          >
            {isOrRelation ? "OR" : "AND"}
          </Button> */}
          {/* replace button with switch */}
          <Switch
            checkedChildren="AND"
            unCheckedChildren="OR"
            checked={!isOrRelation}
            onChange={() => setIsOrRelation(!isOrRelation)}
            className={isOrRelation ? "switch-or" : "switch-and"}
          />
        </div>
      </div>
    </div>
  );
};

export default TableFilter;
