import React, { useState } from "react";
import { Table, Button } from "antd";
import { useQuery } from "@apollo/client";
import { GET_ALL_PEOPLE } from "../graphql/queries";
import TableFilter from "./TableFilter";

const CharactersTable = () => {
  const [endCursor, setEndCursor] = useState("");
  const pagesize = 20;
  const { loading, error, data, fetchMore } = useQuery(GET_ALL_PEOPLE, {
    variables: { first: pagesize, after: endCursor },
    notifyOnNetworkStatusChange: true,
  });

  // return loading and error state
  if (loading) return <p>Loading</p>;
  if (error) return <p>Error</p>;

  //   data.allPeople.people.map((person: any) => {
  //     console.log(person);
  //   });

  // Transfer read person data into table data source
  const dataSource = data.allPeople.edges.map((edge: any) => ({
    key: edge.node.name,
    name: edge.node.name,
    height: edge.node.height,
    weight: edge.node.mass,
    "home-planet": edge.node.homeworld ? edge.node.homeworld.name : "-",
    species: edge.node.species ? edge.node.species.name : "-",
    gender: edge.node.gender,
    eyeColor: edge.node.eyeColor,
  }));

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        after: data.allPeople.pageInfo.endCursor,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult;
        const newEdges = fetchMoreResult.allPeople.edges;
        const pageInfo = fetchMoreResult.allPeople.pageInfo;
        setEndCursor(pageInfo.endCursor);
        return {
          allPeople: {
            __typename: prevResult.allPeople.__typename,
            edges: [...prevResult.allPeople.edges, ...newEdges],
            pageInfo,
          },
        };
      },
    });
  };

  // define table columns
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
    <>
      <TableFilter></TableFilter>
      <Table
        dataSource={dataSource}
        columns={properties_col}
        pagination={false}
      />
      {data.allPeople.pageInfo.hasNextPage && (
        <Button onClick={handleLoadMore} loading={loading}>
          Load More
        </Button>
      )}
    </>
  );
};

export default CharactersTable;
