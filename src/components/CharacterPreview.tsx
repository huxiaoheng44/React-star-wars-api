import React from "react";
import { Button, Modal } from "antd";
import { CharacterProperties } from "../models/models";
import { GET_FILMS } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import CharacterDetail from "./CharacterDetail";

interface CharacterPreviewProps {
  character: CharacterProperties | null;
  isVisible: boolean;
  favorites: CharacterProperties[];
  setFavorites: React.Dispatch<React.SetStateAction<CharacterProperties[]>>;
  onClose: () => void;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({
  character,
  isVisible,
  favorites,
  setFavorites,
  onClose,
}) => {
  const { loading, error, data } = useQuery(GET_FILMS, {
    variables: { personId: character?.key },
    skip: !isVisible,
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <Modal
      title=""
      centered
      open={isVisible}
      onCancel={onClose}
      footer={
        // Check whether the character is already in the favorites list
        favorites.includes(character as CharacterProperties) ? (
          <Button
            key="remove-from-favorites"
            onClick={() =>
              setFavorites(
                favorites.filter(
                  (fav: CharacterProperties) => fav.key !== character?.key
                )
              )
            }
          >
            Remove from Favourites
          </Button>
        ) : (
          <Button
            key="add-to-favorites"
            onClick={() =>
              setFavorites([...favorites, character as CharacterProperties])
            }
          >
            Add to Favourites
          </Button>
        )
      }
      width={700}
    >
      <div className="flex flex-row items-top">
        <div>
          <img
            src={process.env.PUBLIC_URL + "/character.png"}
            alt="character"
            className="h-full"
          />
        </div>
        <div className="flex flex-col items-start h-80 pl-3 grow">
          <p className="font-bold text-3xl pb-5 pt-3">{character?.name}</p>
          <div className="flex items-start justify-start">
            <div className="flex flex-col w-52">
              <CharacterDetail label="Species" value={character?.species} />
              <CharacterDetail label="Gender" value={character?.gender} />
              <CharacterDetail label="Eye Color" value={character?.eyeColor} />
              <CharacterDetail label="Height" value={character?.height} />
              <CharacterDetail label="Weight" value={character?.weight} />
              <CharacterDetail
                label="Home Planet"
                value={character?.homePlanet}
              />
            </div>
            {/* film list */}
            <div className="flex  flex-col justify-center">
              <p className="font-bold text-lg py-1">Films: </p>
              {
                <ul>
                  {data?.person?.filmConnection?.films.map(
                    (film: any, key: number) => (
                      <li key={film.title}>
                        {key + 1}: {film.title}
                      </li>
                    )
                  )}
                </ul>
              }
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CharacterPreview;
