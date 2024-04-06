import React, { useEffect, useState, useRef } from "react";
import { Table, Spin, Alert, Button } from "antd";
import { useQuery } from "@apollo/client";
import { GET_ALL_PEOPLE } from "../graphql/queries";
import { CharacterProperties } from "../models/models";
import TableFilter from "./TableFilter";

const CharactersTable = () => {
  const [endCursor, setEndCursor] = useState("");
  const [allPeople, setAllPeople] = useState<CharacterProperties[]>([]);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [isloadingMore, setIsLoadingMore] = useState(false);
  // Passed to TableFilter to get filtered IDs
  const [filteredIDs, setFilteredIDs] = useState<string[]>([]);
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);
  const loaderRef = useRef(null);

  const pagesize = 20;
  const { loading, error, data, fetchMore } = useQuery(GET_ALL_PEOPLE, {
    variables: { first: pagesize, after: endCursor },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    // monitor filteredIDs
    console.log(filteredIDs);
    if (isFilterEnabled) {
      // get the person info
      const filteredData = allPeople.filter((person) =>
        filteredIDs.includes(person.key)
      );
      // if filteredIDs length less than pagesize, then fetch more data

      setAllPeople(filteredData);
      setIsFilterEnabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFilterEnabled]);

  useEffect(() => {
    if (data?.allPeople?.edges) {
      setAllPeople(() => [
        ...data.allPeople.edges.map(
          (edge: {
            node: {
              id: any;
              name: any;
              height: any;
              mass: any;
              homeworld: { name: any };
              species: { name: any };
              gender: any;
              eyeColor: any;
            };
          }) => ({
            key: edge.node.id,
            name: edge.node.name,
            height: edge.node.height,
            weight: edge.node.mass,
            homePlanet: edge.node.homeworld ? edge.node.homeworld.name : "-",
            species: edge.node.species ? edge.node.species.name : "-",
            gender: edge.node.gender,
            eyeColor: edge.node.eyeColor,
          })
        ),
      ]);

      if (!data.allPeople.pageInfo.hasNextPage) {
        setAllDataLoaded(true);
      }
    }
  }, [data]);

  // if the loaderRef is in view, load more data when user scrolls to bottom of page
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       const first = entries[0];
  //       // Check if scroll bar hit the bottom
  //       if (
  //         window.innerHeight + window.scrollY >=
  //         document.documentElement.scrollHeight
  //       ) {
  //         console.log("bottom of page");
  //         if (
  //           first.isIntersecting &&
  //           data?.allPeople.pageInfo.hasNextPage &&
  //           !loading &&
  //           !loadingMore
  //         ) {
  //           setLoadingMore(true);
  //           setTimeout(() => {
  //             handleLoadMore();
  //             setLoadingMore(false);
  //           }, 1000); // play load more animation for 1 second
  //         }
  //       }
  //     },
  //     { threshold: 1.0 }
  //   );

  //   if (loaderRef.current) {
  //     observer.observe(loaderRef.current);
  //   }

  //   return () => observer.disconnect();
  // }, [loaderRef, loading, data, loadingMore]);

  function handleLoadMore() {
    setIsLoadingMore(true);
    console.log("endCursor", data.allPeople.pageInfo.endCursor);
    console.log("loading more data");
    if (!data.allPeople.pageInfo.hasNextPage) return;
    fetchMore({
      variables: {
        after: data.allPeople.pageInfo.endCursor,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult;
        return {
          allPeople: {
            __typename: prevResult.allPeople.__typename,
            edges: [
              ...prevResult.allPeople.edges,
              ...fetchMoreResult.allPeople.edges,
            ],
            pageInfo: fetchMoreResult.allPeople.pageInfo,
          },
        };
      },
    }).then((res) => {
      console.log(res);
      console.log("loading more success");
      setIsLoadingMore(false);
      // if filter is enabled, then filter the data
      if (isFilterEnabled) {
        const filteredData = allPeople.filter((person) =>
          filteredIDs.includes(person.key)
        );
        setAllPeople(filteredData);
      }
    });
  }

  const properties_col = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Height", dataIndex: "height", key: "height" },
    { title: "Weight", dataIndex: "weight", key: "weight" },
    { title: "Home Planet", dataIndex: "homePlanet", key: "homePlanet" },
    { title: "Species", dataIndex: "species", key: "species" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Eye Color", dataIndex: "eyeColor", key: "eyeColor" },
  ];

  if (error)
    return <Alert message="Error loading data" type="error" showIcon />;

  return (
    <>
      <TableFilter
        filteredIDs={filteredIDs}
        setFilteredIDs={setFilteredIDs}
        setIsFilterEnabled={setIsFilterEnabled}
      />
      <Table
        dataSource={allPeople}
        columns={properties_col}
        pagination={false}
      />
      <div className="my-2 w-full flex justify-center" ref={loaderRef}>
        {!allDataLoaded ? (
          // <div>
          //   Loading More...
          //   <Spin size="large" />
          // </div>

          // Loading More Button
          <Button
            type="primary"
            loading={isloadingMore}
            onClick={handleLoadMore}
            ghost
          >
            Load More
          </Button>
        ) : (
          <Alert message="All Characters Data Loaded" type="success" showIcon />
        )}
      </div>
    </>
  );
};

export default CharactersTable;
