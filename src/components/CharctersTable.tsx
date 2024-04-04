import React from "react";
import { Table } from "antd";
import { useQuery } from "@apollo/client";
import { GET_ALL_PEOPLE } from "../graphql/queries";

const CharactersTable = () => {
  const { loading, error, data } = useQuery(GET_ALL_PEOPLE);
  if (loading) return <p>Loading</p>;
  if (error) return <p>Error</p>;

  data.allPeople.people.map((person: any) => {
    console.log(person);
  });

  const dataSource = data.allPeople.people.map((person: any) => ({
    key: person.name,
    name: person.name,
    height: person.height,
    weight: person.mass,
    "home-planet": person.homeworld ? person.homeworld.name : "-",
    species: person.species ? person.species.name : "-",
    gender: person.gender,
    eyeColor: person.eyeColor,
  }));

  const properties_col = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Height",
      dataIndex: "height",
      key: "height",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Home Planet",
      dataIndex: "home-planet",
      key: "home-planet",
    },
    {
      title: "Species",
      dataIndex: "species",
      key: "species",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Eye Color",
      dataIndex: "eyeColor",
      key: "eyeColor",
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={properties_col}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default CharactersTable;
