import React, { useEffect, useState, useRef } from "react";
import { Table, Spin, Alert, Button } from "antd";
import { HeartOutlined, HeartFilled, DeleteFilled } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { GET_ALL_PEOPLE } from "../graphql/queries";
import { CharacterProperties } from "../models/models";
import CharacterPreview from "./CharacterPreview";
import TableFilter from "./TableFilter";

interface CharactersTableProp {
  FavoriteMode?: boolean;
}

const CharactersTable: React.FC<CharactersTableProp> = ({ FavoriteMode }) => {
  // Initial table
  const [allPeople, setAllPeople] = useState<CharacterProperties[]>([]);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [isloadingMore, setIsLoadingMore] = useState(false);

  // Passed to TableFilter to get filtered IDs
  const [filteredIDs, setFilteredIDs] = useState<string[]>([]);
  // If filter is enabled, then filter the data
  const [filteredPeople, setFilteredPeople] = useState<CharacterProperties[]>(
    []
  );
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);
  const loaderRef = useRef(null);

  // Character preview
  const [previewVisible, setPreviewVisible] = useState(false);
  const [
    selectedCharacter,
    setSelectedCharacter,
  ] = useState<CharacterProperties | null>(null);

  // Favorites list
  const [favorites, setFavorites] = useState<CharacterProperties[]>([]);
  const [isFavoritesInitialized, setIsFavoritesInitialized] = useState(false);

  const pagesize = 20;
  const { error, data, fetchMore } = useQuery(GET_ALL_PEOPLE, {
    variables: { first: pagesize, after: null },
    notifyOnNetworkStatusChange: true,
    skip: FavoriteMode,
  });

  // Load favorites from local storage
  useEffect(() => {
    const loadedFavorites = localStorage.getItem("favorites");
    if (loadedFavorites) {
      const favoritesArray = JSON.parse(loadedFavorites);
      //console.log("Loaded favorites", favoritesArray);
      setFavorites(favoritesArray);
    }
  }, []);

  useEffect(() => {
    const loadedFavorites = localStorage.getItem("favorites");
    if (loadedFavorites) {
      setFavorites(JSON.parse(loadedFavorites));
    }
    setIsFavoritesInitialized(true); // make sure that favorites are loaded
  }, []);

  useEffect(() => {
    if (isFavoritesInitialized) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, isFavoritesInitialized]);

  // This useEffect will be triggered when initialize favorites as empty array, thus causing local storage being reset as empty.
  // Add favorites to localStorage
  // useEffect(() => {
  //   //console.log(loadedFavorites);
  //   localStorage.setItem("favorites", JSON.stringify(favorites));
  // }, [favorites]);

  useEffect(() => {
    // monitor filteredIDs
    if (isFilterEnabled) {
      // get the person info
      const filteredData = allPeople.filter((person) =>
        filteredIDs.includes(person.key)
      );
      // if filteredIDs length less than pagesize, then fetch more data
      setFilteredPeople(filteredData);
    }
  }, [isFilterEnabled, filteredIDs, allPeople]);

  // if favorite mode is enabled, load data from local storage
  useEffect(() => {
    if (FavoriteMode) {
      setAllPeople(favorites);
    }
  }, [FavoriteMode, favorites]);

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

  const handleDetailsClick = (character: CharacterProperties) => {
    console.log("Details Clicked", character);
    setSelectedCharacter(character);
    setPreviewVisible(true);
  };

  const properties_col = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Height", dataIndex: "height", key: "height" },
    { title: "Weight", dataIndex: "weight", key: "weight" },
    { title: "Home Planet", dataIndex: "homePlanet", key: "homePlanet" },
    { title: "Species", dataIndex: "species", key: "species" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Eye Color", dataIndex: "eyeColor", key: "eyeColor" },
    // Add as favorite button and a preview button
    {
      title: "Action",
      key: "action",
      render: (record: CharacterProperties) => (
        <div>
          <Button onClick={() => handleDetailsClick(record)}>Details</Button>
        </div>
      ),
    },
    {
      title: "IsFavorite",
      key: "isFavorite",
      render: (record: CharacterProperties) =>
        !FavoriteMode ? (
          <div className="flex justify-center">
            {favorites.some((fav) => fav.key === record.key) ? (
              <HeartFilled
                onClick={() => {
                  setFavorites(
                    favorites.filter((fav) => fav.key !== record.key)
                  );
                }}
                style={{ color: "red" }}
              />
            ) : (
              <HeartOutlined
                onClick={() => {
                  setFavorites([...favorites, record]);
                }}
              />
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <DeleteFilled
              onClick={() => {
                setFavorites(favorites.filter((fav) => fav.key !== record.key));
              }}
            />
          </div>
        ),
    },
  ];

  if (error)
    return <Alert message="Error loading data" type="error" showIcon />;

  return (
    <>
      <TableFilter
        filteredIDs={filteredIDs}
        setFilteredIDs={setFilteredIDs}
        setIsFilterEnabled={setIsFilterEnabled}
        isFilterEnabled={isFilterEnabled}
      />
      <Table
        dataSource={isFilterEnabled ? filteredPeople : allPeople}
        columns={properties_col}
        pagination={false}
      />
      <div className="my-2 w-full flex justify-center" ref={loaderRef}>
        {!FavoriteMode &&
          (!allDataLoaded ? (
            // <div>
            //   Loading More...
            //   <Spin size="large" />
            // </div>

            // Loading More Button
            <Button
              type="default"
              loading={isloadingMore}
              onClick={handleLoadMore}
              ghost
            >
              Load More
            </Button>
          ) : (
            <Alert
              message="All Characters Data Loaded"
              type="success"
              showIcon
            />
          ))}
      </div>

      <CharacterPreview
        favorites={favorites}
        setFavorites={setFavorites}
        character={selectedCharacter}
        isVisible={previewVisible}
        onClose={() => setPreviewVisible(false)}
      />
    </>
  );
};

export default CharactersTable;
