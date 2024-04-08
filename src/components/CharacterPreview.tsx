import React from "react";
import { Button, Modal } from "antd";
import { CharacterProperties } from "../models/models";
import { GET_FILMS } from "../graphql/queries";
import { useQuery } from "@apollo/client";

interface CharacterPreviewProps {
  character: CharacterProperties | null;
  isVisible: boolean;
  onClose: () => void;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({
  character,
  isVisible,
  onClose,
}) => {
  const { loading, error, data } = useQuery(GET_FILMS, {
    variables: { personId: character?.key },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <Modal
      title={character?.name || "Character Details"}
      centered
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button
          key="add-to-favorites"
          onClick={() => console.log("Add to Favourites")}
        >
          Add to Favourites
        </Button>,
      ]}
      width={600}
    >
      <div className="flex flex-col items-center">
        {/* <img
          src="https://via.placeholder.com/150"
          alt="character"
          className="mb-4"
        /> */}
        <p>Height: {character?.height}</p>
        <p>Weight: {character?.weight}</p>
        <p>Home Planet: {character?.homePlanet}</p>
        <p>Species: {character?.species}</p>
      </div>
      {/* film list */}
      <div>
        <h3>Films</h3>
        {
          <ul>
            {data?.person?.filmConnection?.films.map((film: any) => (
              <li key={film.title}>{film.title}</li>
            ))}
          </ul>
        }
      </div>
    </Modal>
  );
};

export default CharacterPreview;
